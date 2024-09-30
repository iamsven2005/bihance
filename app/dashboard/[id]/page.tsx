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

export default function Page({ params }: Props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = auth();

      if (!userId) {
        return resolve(redirect("/")); // Early resolve if user is not authenticated
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

        revalidatePath(`/view/${params.id}`);
      }
      resolve(<UploadPage event={params.id} files={files} />);
    } catch (error) {
      reject(error);
    }
  });
}
