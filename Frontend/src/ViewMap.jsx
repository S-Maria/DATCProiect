import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-cluster';

const VeiwMap = () => {
  const [locations, setLocations] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem('token');

    const fetchUserData = async () => {
        try {
          const userDataResponse = await fetch('https://proiect-datc.azurewebsites.net/api/User/currentUser', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
          if (userDataResponse.ok) {
            const userData = await userDataResponse.json();
            setUserData(userData);
            fetchUserReports(userData.id);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

    const fetchUserReports = async (userId) => {
        try {
          const response = await fetch(`https://proiect-datc.azurewebsites.net/api/Report/user/${userId}`, {
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
        fetchUserData();
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

export default VeiwMap;