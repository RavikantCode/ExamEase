import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Starting database seeding...');

        const alice = await prisma.user.upsert({
            where: {
                moodle_id: '22104194'
            },
            update: {
                password: await bcrypt.hash('alice', 10),
                name: 'Alice Johnson',
            },
            create: {
                moodle_id: '22104194',
                password: await bcrypt.hash('alice', 10),
                name: 'Alice Johnson',
            }
        })

        console.log('✅ Created/Updated user Alice:', alice)

        const bob = await prisma.user.upsert({
            where: {
                moodle_id: '22104195'
            },
            update: {
                password: await bcrypt.hash('bob123', 10),
                name: 'Bob Smith',
            },
            create: {
                moodle_id: '22104195',
                password: await bcrypt.hash('bob123', 10),
                name: 'Bob Smith',
            }
        })

        console.log('✅ Created/Updated user Bob:', bob)

        const teacher = await prisma.user.upsert({
            where: {
                moodle_id: 'teacher001'
            },
            update: {
                password: await bcrypt.hash('teacher123', 10),
                name: 'Dr. Sarah Wilson',
            },
            create: {
                moodle_id: 'teacher001',
                password: await bcrypt.hash('teacher123', 10),
                name: 'Dr. Sarah Wilson',
            }
        })

        console.log('✅ Created/Updated teacher:', teacher)
        console.log('🎉 Database seeding completed successfully!')

    } catch (error) {
        console.error('❌ Error seeding database:', error)
        throw error
    }
}

main()
    .catch((e) => {
        console.error('❌ Seed script failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        console.log('🔌 Disconnected from database')
    })