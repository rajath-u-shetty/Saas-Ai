import DashBoard from "@/components/DashBoard";
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";
import { redirect } from "next/navigation"

const page = async() => {
  const session = await getAuthSession();
  const user = session?.user

  if(!user){
    redirect("/sign-in")
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id
    }
  })

  if(!dbUser){
    redirect("/sign-in")
  }


  return (
    <DashBoard />
  )
}

export default page
