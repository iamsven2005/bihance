"use client";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { FC } from "react";

interface UploadBtnProps {
  done?: (url: string, name: string) => void;
  variant?: "btn" | "dpzn"; // Marking variant as optional
}

const UploadBtn: FC<UploadBtnProps> = ({ done, variant = "btn" }) => {
  const handleUploadComplete = async (res: any) => {
    const url = res[0]?.url;
    const urlname = res[0]?.name;
    console.log(urlname);
    if (done) {
      done(url, urlname);
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error("Unable to upload file");
  };

  return (
    <>
      {variant === "btn" ? (
        <UploadButton
          endpoint="fileUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      ) : (
        <UploadDropzone
          endpoint="fileUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      )}
    </>
  );
};

export default UploadBtn;
