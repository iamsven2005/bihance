import React from "react";
import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const UploadPage = dynamic(() => import("./UploadPage"), { ssr: false });
interface Props{
    params:{
        id: string
    }
}
export default function Page({params}: Props) {
  const {userId} = auth()
  if(!userId){
    toast.error("Please Sign In")
    return redirect("/")
  }
  return (
    <div>
      <UploadPage event={params.id}/>
    </div>
  );
}
