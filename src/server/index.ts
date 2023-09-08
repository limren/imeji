import { PrismaClient } from "@prisma/client";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getHello: publicProcedure.query(async () => {
    const prisma = new PrismaClient();
    // await prisma.
    return "Hello world";
  }),
});

export type AppRouter = typeof appRouter;
