import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './Login';
import RegisterForm from './Register';
import Home from './Home';
import AdminComponent from './AdminComponent';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserDetails(token);
    }
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch('https://proiect-datc.azurewebsites.net/api/User/currentUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.role);
        const userRole = data.role;

        setIsAdmin(userRole === 'ADMIN');
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserDetails(token);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <div className="App">
      <div className="circle-button">
            <button className="circle-button__button"></button>
      </div>
      {!isOnline ? (
       <h1>Please go online to report an issue.</h1>
      ) : (
      <div>
        <h1>Report an Issue</h1>
        <br></br>
        {isLoggedIn ? (
          isAdmin ? (
            <AdminComponent onLogout={handleLogout} />
          ) : (
            <Home onLogout={handleLogout} />
          )
        ) : (
          <div className="App">
            <LoginForm onLogin={handleLogin}/>
            <br></br>
            <RegisterForm onLogin={handleLogin}/>
          </div>
        )}
      </div>
        )}
    </div>
  );
};

export default App;