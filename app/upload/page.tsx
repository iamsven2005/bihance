import React from "react";
import dynamic from "next/dynamic";

const UploadPage = dynamic(() => import("./UploadPage"), { ssr: false });

export default function Page() {
  return (
    <div>
      <UploadPage />
    </div>
  );
}
