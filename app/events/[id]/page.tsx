import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import ImageGallery from "./image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params }: Props) => {
  const images = await db.image.findMany({
    where: {
      eventId: params.id,
    },
  });
  const name = await db.polling.findFirst({
    where:{
      id: params.id
    }
  })

  return (
    <Card>
      <CardHeader>
      <CardTitle
      >
        {name?.title}
      </CardTitle>
      </CardHeader>
      <CardContent className="mx-auto items-center justify-center">
        <ImageGallery images={images} />
      </CardContent>
    </Card>
  );
};

export default Page;
