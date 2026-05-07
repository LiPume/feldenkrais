import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getRuntimeDatabaseUrl } from '@/server/env';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  prismaUrl?: string;
};

function createPrismaClient(connectionString: string) {
  const url = new URL(connectionString);
  const sslMode = url.searchParams.get('sslmode');
  const isLocalDatabase = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  const needsSsl = !isLocalDatabase && sslMode !== 'disable';
  const adapter = new PrismaPg({
    connectionString,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export function getPrismaClient(): PrismaClient {
  const databaseUrl = getRuntimeDatabaseUrl();

  if (!globalForPrisma.prisma || globalForPrisma.prismaUrl !== databaseUrl) {
    globalForPrisma.prisma = createPrismaClient(databaseUrl);
    globalForPrisma.prismaUrl = databaseUrl;
  }

  return globalForPrisma.prisma;
}
