import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

const page = async({params}: {params: {fileid: string}}) => {
    const { fileid } = params;

    const session = await getAuthSession()
    if(!session?.user || !session.user.id){
        redirect("/sign-in");
    }

    const file = await db.file.findFirst({
        where: {
            id: fileid,
            userId: session.user.id,
        }
    })

    if(!file){
        notFound()
    }

  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            {/* <PdfRenderer url={file.url} /> */}
          </div>
        </div>

        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          {/* <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} /> */}
        </div>
      </div>
    </div>
  )
}

export default page
