import { getAuthSession } from "@/lib/auth";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";

type UserId = string

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId
    username?: string | null
  }
}

export const appRouter = router({
    authCallback: publicProcedure.query(async() => {
        const session = await getAuthSession();
        const user = session?.user

        if (!user?.id || !user.email){
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        const dbUser = await db.user.findFirst({
          where: {
            id: user.id,
          }
        })

        if(!dbUser){
          await db.user.create({
            data: {
              id: user.id,
              email: user.email,
            }
          })
        }

        return {success: true}
    }),
    getUserFiles: privateProcedure.query(async({ctx}) => {
      const {userId, user} = ctx
      return await db.file.findMany({
        where: {
          userId
        }
      })
    })
});

export type AppRouter = typeof appRouter;   