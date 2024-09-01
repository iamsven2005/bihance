import { db } from "@/lib/db";
import Page from "./PageComponent"; // Update the import path to your client component
interface props{
    params:{
        id: string
    }
}
export default async function EventPage({ params }: props) {
  const images = await db.image.findMany({
    where: {
      eventId: params.id,
    },
    orderBy: {
      order: "asc",
    },
  });

  return <Page params={params} initialImages={images} />;
}
