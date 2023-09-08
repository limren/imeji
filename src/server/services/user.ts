import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const createPost = async (
  authorId: number,
  title: string,
  description?: string
) => {
  try {
    return await prisma.user.update({
      where: {
        id: authorId,
      },
      data: {
        Posts: {
          create: {
            title: title,
            description: description,
          },
        },
      },
    });
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `An error occurred while creating a post : ${err}`,
    });
  }
};

const getOrCreateCategoryIds = async (categories: string[]) => {
  const categoryIds = [];

  for (const categoryName of categories) {
    let category = await prisma.category.findFirst({
      where: {
        category: categoryName,
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          category: categoryName,
        },
      });
    }

    categoryIds.push(category.id);
  }

  return categoryIds;
};

export const createImagePost = async (postId: number, categories: string[]) => {
  try {
    const allCategoriesId = await getOrCreateCategoryIds(categories);
    return await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ImagePost: {
          create: {
            Categories: {
              connect: allCategoriesId.map((id) => ({
                id: id,
              })),
            },
          },
        },
      },
    });
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `An error occurred while creating an image post : ${err}`,
    });
  }
};
