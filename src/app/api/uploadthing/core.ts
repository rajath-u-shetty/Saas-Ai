import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { pinecone } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
 
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
        const createFile = await db.file.create({
            data:{
                key: file.key,
                name: file.name,
                userId: metadata.userId,
                url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
                uploadStatus: "PROCESSING"
            }
        })

        try {
            const res = await fetch(`https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`)
            const blob = await res.blob();

            const loader = new PDFLoader(blob)

            const pageLevelDocs = await loader.load();
            
            const pagesAmt = pageLevelDocs.length

            const pineconeIndex = pinecone.Index("ai-saas")

            const embeddings = new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY,
            })

            await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
                pineconeIndex,
                namespace: createFile.id,
            })

            await db.file.update({
                data: {
                    uploadStatus: 'SUCCESS'
                },
                where: {
                    id: createFile.id
                }
            })
        } catch (error) {
            await db.file.update({
                data: {
                    uploadStatus: 'FAILED'
                },
                where: {
                    id: createFile.id
                }
            })
        }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;