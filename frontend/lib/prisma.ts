import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

let prismaClient: PrismaClient | undefined = globalForPrisma.prisma;

function createPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaClient;
    }
  }
  return prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(createPrismaClient() as object, prop, receiver);
  },
});
