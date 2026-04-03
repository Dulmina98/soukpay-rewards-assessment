import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/me', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                id: true,
                email: true,
                name: true,
                created_at: true,
                ledger: {
                    select: { delta: true }
                }
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const balance = user.ledger.reduce((sum, entry) => sum + entry.delta, 0);

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at,
            balance,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/me/transactions', async (req: AuthRequest, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    try {
        const [transactions, total] = await Promise.all([
            prisma.pointLedger.findMany({
                where: { user_id: req.user!.userId },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
            }),
            prisma.pointLedger.count({
                where: { user_id: req.user!.userId }
            })
        ]);

        res.json({
            data: transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;