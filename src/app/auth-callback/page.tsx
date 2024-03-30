import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client";

const page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams.get("origin");

    const {data, isLoading} = trpc.authCallback.useQuery(undefined, {
         
    })
  return (
    <div>
      
    </div>
  )
}

export default page
