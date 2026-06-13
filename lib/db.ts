import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = global as typeof global & {
  prisma?: PrismaClient;
};

function createPrisma() {
  const adapter = new PrismaLibSql({
    url: `file:${path.join(process.cwd(), "data", "database.db")}`,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
