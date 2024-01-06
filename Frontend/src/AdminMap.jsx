import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-cluster';

const AdminMap = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
        try {
          const response = await fetch('https://proiect-datc.azurewebsites.net/api/Report', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setLocations(data);
          } else {
            throw new Error('Failed to fetch data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      if (token) {
        fetchData();
      }
    }, []);

  return (
    <div>
        <MapContainer center={[45.75372, 21.22571]} zoom={13}>
            <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.length > 0 && (
                <MarkerClusterGroup>
                    {locations.map((location, index) => (
                        <Marker key={index} position={[location.latitude, location.longitude]}>
                            <Popup>
                              <div className='btn_txt2'>
                                <p>ID: {location.id}</p>
                                <p>Issue: {location.type}</p>
                                <p>Status: {location.status}</p>
                              </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            )}
        </MapContainer>
    </div>
  );
};

export default AdminMap;