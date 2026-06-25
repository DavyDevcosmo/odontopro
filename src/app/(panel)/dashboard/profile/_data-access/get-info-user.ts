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

    const user = await prisma.user.findFirst({
      where: userId ? { id: userId } : { email },
      include: {
        subscription: true,
      }
    })

    if (!user) {
      return null;
    }

    return user;

  } catch (err) {
    console.log(err);
    return null;
  }
}