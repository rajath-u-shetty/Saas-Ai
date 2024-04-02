import { string, z } from "zod";

export const SendMessageValidator = z.object({
    fileId: z.string(),
    message: z.string()
})