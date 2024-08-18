import { redirect } from 'next/navigation';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import BoardTitle from './BoardTitle'; 
import PageCLient from './clientPage';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ActivityAudit from "./activity"
import { OrganizationList } from '@clerk/nextjs';

const Page = async () => {
  const { userId, orgId } = auth();

  if (!userId) {
    redirect('/');
  }
  if (!orgId){
    return (
      <div className='flex mx-auto justify-center items-center flex-col gap-3'>
        <h1 className='font-bold '>You need to create an organization to continue
          </h1>
        <OrganizationList/>
      </div>
    )
  }

  const user = await db.user.findFirst({
    where: {
      clerkId: userId,
    },
    select: {
      board: true,
    },
  });

  if (!user) {
    redirect('/');
  }

  if (!user.board) {
    redirect(`/workspace/${orgId}`);
  }

  const boarddet = await db.board.findFirst({
    where: {
      id: user.board,
    },
    include:{
      list: true
    }
  });

  if (!boarddet || !boarddet.id) {
    redirect(`/workspace/${orgId}`);
  }

  const lists = await db.list.findMany({
    where: {
      boardId: boarddet.id, // We know this is now defined
      board: {
        orgId,
      },
    },
    include: {
      card: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div
      className='relative h-full bg-no-repeat bg-cover bg-center min-h-screen'
      style={{ 
        backgroundImage: `url(${boarddet?.imageFullUrl})`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a slight darkness
        backgroundBlendMode: 'overlay', // Blend the color with the image
      }}
    >
      <div className='w-full h-20 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4'>
        <BoardTitle initialTitle={boarddet?.title || ''} boardId={boarddet.id} />
        <Sheet >
          <SheetTrigger asChild>
            <Button variant="outline">Activity</Button>
          </SheetTrigger>
          <SheetContent side={"right"}>
            <SheetHeader>
              <SheetTitle>DashboardLog</SheetTitle>
              <SheetDescription>
                <ActivityAudit id={orgId}/>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className='absolute inset-0 bg-black/10' />
      <PageCLient board={boarddet.id} lists={lists}/>
    </div>
  );
}

export default Page;
