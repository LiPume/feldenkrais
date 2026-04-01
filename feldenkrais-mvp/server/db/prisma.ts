import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getDatabaseEnv } from '@/server/env';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const { databaseUrl, directUrl } = getDatabaseEnv();
  const runtimeUrl =
    process.env.NODE_ENV === 'development'
      ? directUrl
      : databaseUrl;
  const adapter = new PrismaPg(runtimeUrl);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}
