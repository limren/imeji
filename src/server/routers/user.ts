import { z } from "zod";
import { router } from "../trpc";
import { authedProcedure } from "../trpc";
import { createImagePost, createPost } from "../services/user";

export const userRouter = router({
  createPost: authedProcedure
    .input(
      z.object({
        authorId: z.number(),
        title: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { authorId, title, description } = opts.input;
      return await createPost(authorId, title, description);
    }),
  createImagePost: authedProcedure
    .input(
      z.object({
        postId: z.number(),
        categories: z.array(z.string()),
      })
    )
    .mutation(async (opts) => {
      const { postId, categories } = opts.input;

      return await createImagePost(postId, categories);
    }),
});
