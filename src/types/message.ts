import { AppRouter } from "@/app/trpc";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>

type Messages = RouterOutput['getFileMessage']['messages']

type OmitText = Omit<Messages[number], 'text'>

type ExtendedText =  {
    text: string | JSX.Element
}

export type ExtendedMessages = OmitText & ExtendedText