import prisma from "@/lib/prisma";

interface GetUserDataProps {
  userId?: string;
  email?: string;
}

export async function getUserData({ userId, email }: GetUserDataProps) {
  try {

    if (!userId && !email) {
      return null;
    }

    const include = { subscription: true } as const

    if (userId) {
      const userById = await prisma.user.findFirst({
        where: { id: userId },
        include,
      })
      if (userById) {
        return userById
      }
    }

    if (email) {
      return prisma.user.findFirst({
        where: { email },
        include,
      })
    }

    return null;

  } catch (err) {
    console.error("[getUserData]", err);
    return null;
  }
}