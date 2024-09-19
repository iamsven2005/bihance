import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { UTApi } from "uploadthing/server";
 export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

export async function DELETE(request: Request) {
  const { url } = await request.json();
  const newUrl = url.substring(url.lastIndexOf("/") + 1);
  const utapi = new UTApi(); 
  await utapi.deleteFiles(newUrl);
  console.log("deleted")
  return Response.json({ message: "ok" });
}