import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();

const handleAuth = async() => {
    const session = await getAuthSession()
    const user = session?.user

    if(!user){
        throw new UploadThingError("Unauthorized")
    }
    return {userId: user.id}
}
 
export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
        const createUrl = await db.file.create({
            data:{
                key: file.key,
                name: file.name,
                userId: metadata.userId,
                url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
                uploadStatus: "PROCESSING"
            }
        })
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;