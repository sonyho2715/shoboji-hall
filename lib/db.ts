import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Strip ?sslmode=require from the URL so it does not conflict with the
  // explicit ssl object below. The pg library v8+ treats sslmode=require as
  // verify-full, which rejects Railway's self-signed cert even when
  // rejectUnauthorized is false. We pass SSL settings via the ssl option only.
  const cleanConnectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');

  const adapter = new PrismaPg({
    connectionString: cleanConnectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
