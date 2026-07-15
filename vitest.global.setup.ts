import { PrismaClient } from "./prisma/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { assertDestructiveDbAccess } from "./src/env/config"

async function cleanupTestDatabase() {
  assertDestructiveDbAccess()

  const databaseUrl = process.env.DATABASE_URL ?? ""
  const adapter = new PrismaPg({ connectionString: databaseUrl })
  const prisma = new PrismaClient({ adapter })

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
    `)
  } finally {
    await prisma.$disconnect()
  }
}

export async function setup() {
  await cleanupTestDatabase()
}

export async function teardown() {
  await cleanupTestDatabase()
}
