import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const rewards = await prisma.reward.findMany({
            where: {
                is_active: true,
                stock_remaining: { gt: 0 }
            },
            orderBy: { points_cost: 'asc' }
        });

        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:id/redeem', async (req: AuthRequest, res: Response): Promise<void> => {
    const rewardId = req.params['id'] as string;
    const userId = req.user!.userId;
    const idempotencyKey = req.headers['x-idempotency-key'] as string;

    if (!idempotencyKey) {
        res.status(400).json({ error: 'X-Idempotency-Key header is required' });
        return;
    }

    try {
        const existing = await prisma.redemption.findUnique({
            where: { idempotency_key: idempotencyKey }
        });

        if (existing) {
            res.json({ message: 'Already redeemed', redemption: existing });
            return;
        }

        const result = await prisma.$transaction(async (tx) => {
            const reward = await tx.reward.findUnique({
                where: { id: rewardId }
            });

            if (!reward || !reward.is_active) {
                throw new Error('REWARD_NOT_FOUND');
            }

            if (reward.stock_remaining <= 0) {
                throw new Error('OUT_OF_STOCK');
            }

            const balanceResult = await tx.pointLedger.aggregate({
                where: { user_id: userId },
                _sum: { delta: true }
            });

            const balance = balanceResult._sum.delta ?? 0;

            if (balance < reward.points_cost) {
                throw new Error('INSUFFICIENT_POINTS');
            }

            await tx.reward.update({
                where: { id: rewardId },
                data: { stock_remaining: { decrement: 1 } }
            });

            await tx.pointLedger.create({
                data: {
                    user_id: userId,
                    delta: -reward.points_cost,
                    reason: `Redeemed: ${reward.name}`,
                }
            });

            const redemption = await tx.redemption.create({
                data: {
                    user_id: userId,
                    reward_id: rewardId,
                    points_cost: reward.points_cost,
                    idempotency_key: idempotencyKey,
                }
            });

            return { redemption, reward };
        });

        res.status(201).json({
            message: 'Redemption successful',
            ...result
        });

    } catch (error: any) {
        const errorMap: Record<string, [number, string]> = {
            INSUFFICIENT_POINTS: [400, 'Insufficient points'],
            OUT_OF_STOCK: [400, 'Reward out of stock'],
            REWARD_NOT_FOUND: [404, 'Reward not found'],
        };

        const mapped = errorMap[error.message];
        if (mapped) {
            res.status(mapped[0]).json({ error: mapped[1] });
        } else {
            console.error('Redemption error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

export default router;