"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue by setting the default icon URLs
const DefaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMapComponent = () => {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this code runs only on the client
  }, []);

  useEffect(() => {
    if (isClient && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          switch (error.code) {
            case 1:
              setError('User denied the request for Geolocation.');
              break;
            case 2:
              setError('Location information is unavailable.');
              break;
            case 3:
              setError('The request to get user location timed out.');
              break;
            default:
              setError('An unknown error occurred.');
              break;
          }
        }
      );
    } else if (!isClient) {
      setError('Geolocation is not supported by this browser.');
    }
  }, [isClient]);

  if (!isClient) {
    return <p>Loading...</p>; // or any other loading indicator
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Location</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        location ? (
          <MapContainer center={[location.latitude, location.longitude]} zoom={13} style={{ height: '450px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>
                You are here
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading...</p>
        )
      )}
    </div>
  );
};

export default LeafletMapComponent;
