import React from "react";
import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const UploadPage = dynamic(() => import("./UploadPage"), { ssr: false });

export default function Page() {
  const {userId} = auth()
  if(!userId){
    return redirect("/")
  }
  return (
    <div>
      <UploadPage />
    </div>
  );
}
