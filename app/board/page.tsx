import { redirect } from 'next/navigation';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import BoardTitle from './BoardTitle'; 
import PageClient from './clientPage';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ActivityAudit from "./activity";
import { OrganizationList } from '@clerk/nextjs';

const Page = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, orgId } = auth();

      if (!userId) {
        return resolve(redirect('/'));
      }

      if (!orgId) {
        return resolve(
          <div className='flex mx-auto justify-center items-center flex-col gap-3'>
            <h1 className='font-bold'>You need to create an organization to continue</h1>
            <OrganizationList />
          </div>
        );
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
        return resolve(redirect('/'));
      }

      if (!user.board) {
        return resolve(redirect(`/workspace/${orgId}`));
      }

      const boarddet = await db.board.findFirst({
        where: {
          id: user.board,
        },
        include: {
          list: true,
        },
      });

      if (!boarddet || !boarddet.id) {
        return resolve(redirect(`/workspace/${orgId}`));
      }

      const lists = await db.list.findMany({
        where: {
          boardId: boarddet.id,
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

      return resolve(
        <div
          className='relative h-full bg-no-repeat bg-cover bg-center min-h-screen'
          style={{ 
            backgroundImage: `url(${boarddet?.imageFullUrl})`,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className='w-full h-20 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4'>
            <BoardTitle initialTitle={boarddet?.title || ''} boardId={boarddet.id} />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Activity</Button>
              </SheetTrigger>
              <SheetContent side={"right"}>
                <SheetHeader>
                  <SheetTitle>Dashboard Log</SheetTitle>
                  <SheetDescription>
                    <ActivityAudit id={orgId} />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className='absolute inset-0 bg-black/10' />
          <PageClient board={boarddet.id} lists={lists} />
        </div>
      );
    } catch (error) {
      reject(error); // Reject the promise on error
    }
  });
};

export default Page;
