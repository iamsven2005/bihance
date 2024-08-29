import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const UploadPage = dynamic(() => import("./UploadPage"), { ssr: false });

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const files = await db.files.findMany({ where: { eventId: params.id } });

  const existingPayroll = await db.payroll.findFirst({
    where: {
      userId,
      eventid: params.id,
    },
  });

  if (!existingPayroll) {
    await db.payroll.create({
      data: {
        userId,
        eventid: params.id,
        rolltype: "invited",
      },
    });
    revalidatePath(`/view/${params.id}`)
  }

  return <UploadPage event={params.id} files={files} />;
}
