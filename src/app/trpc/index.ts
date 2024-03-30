import { getAuthSession } from "@/lib/auth";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

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

        if(!user || !user?.email){
            throw new TRPCError({ code: "BAD_REQUEST"})
        }

        return {success: true}
    })
});

export type AppRouter = typeof appRouter;   