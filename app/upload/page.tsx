"use client";

import { useEffect, useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import axios from 'axios';
import { event } from "@prisma/client";

interface Location {
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [events, setEvents] = useState<event[]>([]);

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
    } else {
      setError('Geolocation is not supported by this browser.');
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setCurrentTime(formattedTime);

    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString();
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Fetch events
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/getEvents');
        console.log('Fetched events:', response.data);
        if (response.status === 200) {
          setEvents(response.data);
        } else {
          setError('Failed to fetch events');
        }
      } catch (error) {
        setError('Failed to fetch events');
      }
    };

    fetchEvents();
  }, []);

  const handleUploadComplete = (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    setImageUrls((prevUrls) => [...prevUrls, ...urls]);
    console.log("Files: ", res);
    alert("Upload Completed");
  };

  const handleUploadError = (error: Error) => {
    alert(`ERROR! ${error.message}`);
  };

  const handleSubmit = async () => {
    const locationString = location ? `${location.latitude},${location.longitude}` : 'Unknown location';

    try {
      const response = await axios.post('/api/saveAttendance', {
        imageurl: imageUrls[0],
        time: currentTime,
        location: locationString
      });

      if (response.status === 200) {
        setSubmitSuccess("Attendance saved successfully!");
        setSubmitError(null);
      } else {
        setSubmitError("Failed to save attendance.");
        setSubmitSuccess(null);
      }
    } catch (error) {
      setSubmitError("Failed to save attendance.");
      setSubmitSuccess(null);
      console.error("Failed to save attendance", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <div className="flex flex-col items-center justify-center">
        {location ? (
          <div>
            <h1>Your Location:</h1>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <h2>Current Time: {currentTime}</h2>
          </div>
        ) : (
          <div>
            <h1>Loading location...</h1>
            {error && <p>Error: {error}</p>}
          </div>
        )}
      </div>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
      <div className="mt-8 grid grid-cols-3 gap-4">
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
      <div className="mt-8">
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </div>
      {submitError && <p className="mt-4 text-red-500">{submitError}</p>}
      {submitSuccess && <p className="mt-4 text-green-500">{submitSuccess}</p>}
      <div className="mt-8">
        <h2>Available Events:</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event: event) => (
              <li key={event.eventid}>
                {event.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </main>
  );
}
