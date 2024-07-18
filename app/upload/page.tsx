"use client";

import { useEffect, useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import axios from 'axios';
import { event } from "@prisma/client";
import { ComboboxDemo } from "./ComboBox"; // Adjust the import path as necessary
import { toast } from "sonner";

interface Location {
  latitude: number;
  longitude: number;
}

const UploadPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDatetime, setCurrentDatetime] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [events, setEvents] = useState<event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

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
      toast.error("Unable to get location")
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        console.log('Fetched events:', response.data);
        if (response.status === 200) {
          setEvents(response.data);
        } else {
          setError('Failed to fetch events');
        }
      } catch (error) {
        setError('Failed to fetch events');
        toast.error("No events found")
      }
    };

    fetchEvents();
  }, []);

  const handleUploadComplete = (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    setImageUrls((prevUrls) => [...prevUrls, ...urls]);
    console.log("Files: ", res);
    toast.success("Image uploaded")
  };

  const handleUploadError = (error: Error) => {
    toast.error("Unable to upload")
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
      toast.success("Submitted attendance")
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
            <div key={index} className="relative w-full h-48 group">
              <img
                src={url}
                alt={`Uploaded image ${index + 1}`}
                className="object-cover w-full h-full group-hover:opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                <span className="text-xl font-bold">Uploaded image {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {submitError && <p className="mt-4 text-red-500">{submitError}</p>}
      {submitSuccess && <p className="mt-4 text-green-500">{submitSuccess}</p>}
      <div className="flex flex-wrap gap-5">
        <ComboboxDemo events={events} onSelect={setSelectedEvent} />
        <div onClick={handleSubmit} className="btn btn-outline">
          Submit
        </div>
      </div>
      <h2 className="font-bold text-xl m-5">Available Events:</h2>
      {events.length > 0 ? (
        <div className="flex flex-wrap gap-5">
          {events.map((event) => (
            <div key={event.eventid} className="relative w-64 rounded-xl shadow-xl p-5 text-base-100 group">
              <img src={event.image} alt={event.name} className="absolute inset-0 object-cover w-full h-full rounded-xl opacity-70 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
              <div className="relative z-10 p-5 text-white">
                <h3 className="font-bold text-lg">{event.name}</h3>
                <div className="text-sm">
                  <p>Description:</p>
                  <div dangerouslySetInnerHTML={{__html: event.description}}></div>
                </div>
                <br/>
                <p>Location:</p>
                <p>{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No events available.</p>
      )}
    </main>
  );
}

export default UploadPage;
