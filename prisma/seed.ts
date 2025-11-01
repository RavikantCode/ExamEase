import { PrismaClient, Role } from '../app/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🚀 Starting database seeding...');

        const ravi = await prisma.user.upsert({
            where: { moodle_id: '22104194' },
            update: {
                password: await bcrypt.hash('ravikant', 10),
                name: 'Ravikant Yadav',
            },
            create: {
                moodle_id: '22104194',
                password: await bcrypt.hash('ravikant', 10),
                name: 'Ravikant Yadav',
                role: Role.FACULTY,
            },
        });
        console.log('✅ Created/Updated user ravi:', ravi);

        const nitesh = await prisma.user.upsert({
            where: { moodle_id: '22104098' },
            update: {
                password: await bcrypt.hash('nitesh', 10),
                name: 'Nitesh Soni',
            },
            create: {
                moodle_id: '22104098',
                password: await bcrypt.hash('nitesh', 10),
                name: 'Nitesh Soni',
                role: Role.ADMIN,
            },
        });
        console.log('✅ Created/Updated user nitesh:', nitesh);

        const priya = await prisma.user.upsert({
            where: { moodle_id: '22104208' },
            update: {
                password: await bcrypt.hash('prince', 10),
                name: 'Priya Singh',
            },
            create: {
                moodle_id: '22104208',
                password: await bcrypt.hash('prince', 10),
                name: 'Priya Singh',
                role: Role.ADMIN,
            },
        });
        console.log('✅ Created/Updated user priya:', priya);

        const prince = await prisma.user.upsert({
            where: { moodle_id: '22104065' },
            update: {
                password: await bcrypt.hash('priya', 10),
                name: 'Prince Yadav',
            },
            create: {
                moodle_id: '22104065',
                password: await bcrypt.hash('priya', 10),
                name: 'Prince Yadav',
                role: Role.FACULTY,
            },
        });
        console.log('✅ Created/Updated user prince:', prince);

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('❌ Seed script failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🔌 Disconnected from database');
    });
