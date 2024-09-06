import { db } from "@/lib/db";
import Page from "./PageComponent"; // Update the import path to your client component

interface Props {
  params: {
    id: string;
  };
}

export default function EventPage({ params }: Props) {
  return new Promise(async (resolve, reject) => {
    try {
      const images = await db.image.findMany({
        where: {
          eventId: params.id,
        },
        orderBy: {
          order: "asc",
        },
      });

      resolve(<Page params={params} initialImages={images} />);
    } catch (error) {
      reject(error);
    }
  });
}
