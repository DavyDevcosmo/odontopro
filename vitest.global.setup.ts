// vitest.global.setup.ts

import { PrismaClient } from './prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function cleanupTestDatabase() {
  const databaseUrl = process.env.DATABASE_URL ?? '';

  if (process.env.IS_TEST_DATABASE !== 'true') {
    throw new Error(
      '🚨 IS_TEST_DATABASE não está definida como "true". ' +
        'Abortando limpeza para evitar apagar dados reais.',
    );
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE
        table_name text;
      BEGIN
        FOR table_name IN
          SELECT tablename FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename != '_prisma_migrations'
        LOOP
          EXECUTE format('TRUNCATE TABLE %I RESTART IDENTITY CASCADE', table_name);
        END LOOP;
      END $$;
    `);
  } finally {
    await prisma.$disconnect();
  }
}

export async function setup() {
  await cleanupTestDatabase();
}

export async function teardown() {
  await cleanupTestDatabase();
}