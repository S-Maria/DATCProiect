import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css'

const MapWithPin = ({ onPinPlaced }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
        onPinPlaced(latitude, longitude);
    }
  }, [latitude, longitude, onPinPlaced]);

  const PinMarker = () => {
    const map = useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setLatitude(lat);
        setLongitude(lng);
      },
    });

    return latitude && longitude ? <Marker position={[latitude, longitude]} /> : null;
  };

  return (
    <div>
        <MapContainer center={[45.75372, 21.22571]} zoom={13}>
            <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <PinMarker />
        </MapContainer>
    </div>
  );
};

export default MapWithPin;