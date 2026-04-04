import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';

async function main() {
    console.log('Seeding database...');

    await prisma.redemption.deleteMany();
    await prisma.pointLedger.deleteMany();
    await prisma.reward.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await Promise.all([
        prisma.user.create({
            data: { email: 'alice@example.com', name: 'Alice Johnson', password: hashedPassword }
        }),
        prisma.user.create({
            data: { email: 'bob@example.com', name: 'Bob Smith', password: hashedPassword }
        }),
        prisma.user.create({
            data: { email: 'carol@example.com', name: 'Carol White', password: hashedPassword }
        }),
    ]);

    console.log('✅ Created users');

    await Promise.all([
        prisma.reward.create({
            data: {
                name: 'Free Coffee',
                description: 'A hot or cold coffee of your choice at any participating outlet',
                category: 'Food & Drink',
                image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
                points_cost: 150,
                stock_remaining: 50
            }
        }),
        prisma.reward.create({
            data: {
                name: 'Movie Ticket',
                description: 'One cinema ticket at any branch, valid for all screenings',
                category: 'Entertainment',
                image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
                points_cost: 500,
                stock_remaining: 20
            }
        }),
        prisma.reward.create({
            data: {
                name: 'Shopping Voucher',
                description: '$10 off your next purchase at any partner store',
                category: 'Shopping',
                image_url: 'https://images.unsplash.com/photo-1576678433053-e996459370e3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                points_cost: 300,
                stock_remaining: 100
            }
        }),
        prisma.reward.create({
            data: {
                name: 'Premium Membership',
                description: '1 month premium access with exclusive benefits and discounts',
                category: 'Membership',
                image_url: 'https://images.unsplash.com/photo-1605098293544-25f4c32344c8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                points_cost: 1000,
                stock_remaining: 10
            }
        }),
    ]);

    console.log('✅ Created rewards');

    const ledgerEntries = [
        { delta: 500, reason: 'Welcome bonus' },
        { delta: 200, reason: 'First purchase reward' },
        { delta: 150, reason: 'Referral bonus' },
        { delta: -150, reason: 'Redeemed: Free Coffee' },
        { delta: 300, reason: 'Monthly activity bonus' },
        { delta: 100, reason: 'Survey completion reward' },
        { delta: -300, reason: 'Redeemed: Shopping Voucher' },
        { delta: 250, reason: 'Purchase reward' },
        { delta: 200, reason: 'Birthday bonus' },
        { delta: 100, reason: 'App review reward' },
        { delta: -150, reason: 'Redeemed: Free Coffee' },
        { delta: 400, reason: 'Large purchase reward' },
        { delta: 150, reason: 'Daily login streak bonus' },
        { delta: 200, reason: 'Referral reward' },
        { delta: 100, reason: 'Social share bonus' },
        { delta: -500, reason: 'Redeemed: Movie Ticket' },
    ];

    for (const user of users) {
        for (const entry of ledgerEntries) {
            await prisma.pointLedger.create({
                data: { user_id: user.id, delta: entry.delta, reason: entry.reason }
            });
        }
    }

    console.log('✅ Created ledger entries');
    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────');
    console.log('Test credentials:');
    console.log('  alice@example.com / password123');
    console.log('  bob@example.com   / password123');
    console.log('  carol@example.com / password123');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());