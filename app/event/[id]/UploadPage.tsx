"use client";

import { useEffect, useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import axios from 'axios';
import { event, files } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Files } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Location {
  latitude: number;
  longitude: number;
}

interface Props {
  event: string;
  files: files[];
}

const UploadPage = ({ event: selectedEvent, files }: Props) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDatetime, setCurrentDatetime] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
        }
      );

      const now = new Date();
      const formattedDatetime = now.toISOString();
      setCurrentDatetime(formattedDatetime);

      const intervalId = setInterval(() => {
        const now = new Date();
        const formattedDatetime = now.toISOString();
        setCurrentDatetime(formattedDatetime);
      }, 60000); // Update every minute

      return () => clearInterval(intervalId);
    } else {
      setError('Geolocation is not supported by this browser.');
      toast.error("Unable to get location");
    }
  }, []);

  const handleUploadComplete = (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    setImageUrls((prevUrls) => [...prevUrls, ...urls]);
    console.log("Files: ", res);
    toast.success("Image uploaded");
  };

  const handleUploadError = (error: Error) => {
    toast.error("Unable to upload");
  };

  const handleSubmit = async () => {
    if (!selectedEvent) {
      setSubmitError("Please select an event");
      return;
    }

    const locationString = location ? `${location.latitude},${location.longitude}` : 'Unknown location';

    try {
      const response = await axios.post('/api/saveAttendance', {
        imageurl: imageUrls[0],
        datetime: currentDatetime,
        location: locationString,
        eventId: selectedEvent
      });

      if (response.status === 200) {
        setSubmitSuccess("Attendance saved successfully!");
        setSubmitError(null);
      } else {
        setSubmitError("Failed to save attendance.");
        setSubmitSuccess(null);
      }
      toast.success("Submitted attendance");
    } catch (error) {
      setSubmitError("Failed to save attendance.");
      setSubmitSuccess(null);
      console.error("Failed to save attendance", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between mx-auto">
      <div className="flex flex-wrap items-center justify-center p-5">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
        <div className="flex mx-auto">
          {imageUrls.map((url, index) => (
            <div key={index} className="w-full h-48 relative">
              <img
                src={url}
                alt={`Uploaded image ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
      
      {submitError && <p className="mt-4 text-red-500">{submitError}</p>}
      {submitSuccess && <p className="mt-4 text-green-500">{submitSuccess}</p>}
      <Button onClick={handleSubmit}>
        Submit
      </Button>
      <Card className="bg-base-200 text-base-content m-5 p-5">
      <CardTitle>View related files:</CardTitle>
      {files.map((file) => (
        <CardDescription key={file.id}>
          <Link href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-link">
            <Files/>{file.name}
          </Link>
        </CardDescription>
      ))}
      </Card>
      
    </main>
  );
}

export default UploadPage;
