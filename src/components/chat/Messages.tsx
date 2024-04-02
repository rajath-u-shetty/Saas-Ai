import { trpc } from "@/app/_trpc/client"
import { INFINITE_QUERY_LIMIT } from "@/app/config/infinite-query"
import { Loader2 } from "lucide-react"

interface MessagesProps {
  fileId: string
}

const Messages = ({ fileId }: MessagesProps) => {
  const {data, isLoading, fetchNextPage} = trpc.getFileMessage.useInfiniteQuery({
    fileId,
    limit: INFINITE_QUERY_LIMIT
  }, {
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    // keepPreviousData: true,
  })

  const messages = data?.pages.flatMap((page) => page.messages)

  const loadingMessages = {
    createdAt: new Date().toDateString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-2 w-2 animate-spin" />
      </span>
    )
  }

  const combinedMessages = {
    ...(true ? [loadingMessages] : []),
    ...(messages ?? [])
  }

  return (
    <div className='flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
      {}
      
    </div>
  )
}

export default Messages
