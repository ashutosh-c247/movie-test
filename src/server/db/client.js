import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["query"],
  });
} else {
  if (!global.PrismaClient) {
    global.PrismaClient = new PrismaClient({
      log: ["query"],
    });
  }
  prisma = global.PrismaClient;
}

export default prisma;
