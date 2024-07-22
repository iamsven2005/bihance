import React from "react";
import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { db } from "@/lib/db";

const UploadPage = dynamic(() => import("./UploadPage"), { ssr: false });
interface Props{
    params:{
        id: string
    }
}
export default async function Page({params}: Props) {
  const {userId} = auth()
  if(!userId){
    toast.error("Please Sign In")
    return redirect("/")
  }
  const files = await db.files.findMany({where:{eventId: params.id}})
  return (
    <div>
      <UploadPage event={params.id} files={files}/>
    </div>
  );
}
