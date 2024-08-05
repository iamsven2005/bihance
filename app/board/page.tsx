import { redirect } from 'next/navigation';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import BoardTitle from './BoardTitle'; 

const Page = async () => {
  const { userId, orgId } = auth();

  if (!userId) {
    redirect('/');
    return null; // Ensure we return null after a redirect
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
  });

  return (
    <div
      className='relative h-full bg-no-repeat bg-cover bg-center min-h-screen'
      style={{ backgroundImage: `url(${boarddet?.imageFullUrl})` }}
    >
      <div className='w-full h-20 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white'>
        <BoardTitle initialTitle={boarddet?.title || ''} boardId={user.board} />
      </div>
      <div className='absolute inset-0 bg-black/10' />
      <main className='relative pt-28 h-full'>
        {/* Additional content */}
      </main>
    </div>
  );
}

export default Page;
