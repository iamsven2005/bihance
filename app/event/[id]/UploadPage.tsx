"use client";

import { useEffect, useState } from "react";
import axios from 'axios';
import { event, files } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Files, Upload, MapPin, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import UploadBtn from "@/components/upload";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchLocationAndTime = async () => {
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        } catch (error) {
          if (error instanceof GeolocationPositionError) {
            setError(error.message);
          } else {
            setError('Failed to get location.');
          }
          toast.error("Unable to get location");
        }
      } else {
        setError('Geolocation is not supported by this browser.');
        toast.error("Geolocation not supported");
      }

      const updateTime = () => {
        const now = new Date();
        setCurrentDatetime(now.toISOString());
      };

      updateTime();
      const intervalId = setInterval(updateTime, 60000); // Update every minute

      setIsLoading(false);

      return () => clearInterval(intervalId);
    };

    fetchLocationAndTime();
  }, []);

  const handleUploadComplete = (url: string) => {
    setImageUrls((prevUrls) => [...prevUrls, url]);
    toast.success("Image uploaded successfully");
  };

  const handleSubmit = async () => {
    if (!selectedEvent) {
      setSubmitError("Please select an event");
      return;
    }

    if (!location) {
      setSubmitError("Location is required to submit attendance.");
      toast.error("Location is required");
      return;
    }

    setIsSubmitting(true);
    const locationString = `${location.latitude},${location.longitude}`;

    try {
      const response = await axios.post('/api/attendance', {
        imageurl: imageUrls[0],
        datetime: currentDatetime,
        location: locationString,
        eventId: selectedEvent
      });

      if (response.status === 200) {
        setSubmitSuccess("Attendance saved successfully!");
        setSubmitError(null);
        toast.success("Attendance submitted successfully");
      } else {
        throw new Error("Failed to save attendance.");
      }
    } catch (error) {
      setSubmitError("Failed to save attendance. Please try again.");
      setSubmitSuccess(null);
      toast.error("Failed to submit attendance");
      console.error("Failed to save attendance", error);
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Attendance</CardTitle>
          <CardDescription>Submit your attendance for the selected event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Location not available'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{new Date(currentDatetime).toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <UploadBtn done={handleUploadComplete} />
                <div className="grid grid-cols-2 gap-4 w-full">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger asChild>
              <Button disabled={!location || isLoading || isSubmitting}>
                Submit Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Attendance Submission</DialogTitle>
                <DialogDescription>
                  Are you sure you want to submit your attendance? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Confirm'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Related Files</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.id}>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href={file.url} target="_blank" rel="noopener noreferrer">
                      <Files className="mr-2 h-4 w-4" />
                      <span className="truncate">{file.name}</span>
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No related files available.</p>
          )}
        </CardContent>
      </Card>

      {(submitError || submitSuccess) && (
        <Alert variant={submitError ? "destructive" : "default"} className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{submitError ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{submitError || submitSuccess}</AlertDescription>
        </Alert>
      )}
    </main>
  );
}

export default UploadPage;