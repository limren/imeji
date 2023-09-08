import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { decodeAndVerifyJwtToken } from "./utils/token";
import { Token } from "./utils/interfaces";

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you might want to do in your ctx fn
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await decodeAndVerifyJwtToken(
        req.headers.authorization.split(" ")[1]
      );
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();
  return {
    user,
  };
}
//   export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Token>().create();

const middleware = t.middleware;

const isAuthed = middleware(async (opts) => {
  const { ctx } = opts;
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      userId: ctx.userId,
      iat: ctx.iat,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authedProcedure = publicProcedure.use(isAuthed);
