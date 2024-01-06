import React, { useState } from 'react';
import './App.css';

const EditUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem('token');

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsEditing(false);
  };

  const fetchUser = async () => {

    try {
        const response = await fetch(`https://proiect-datc.azurewebsites.net/api/User/currentUser`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        openModal();
      }
    };
  
    const handleEdit = async () => {
        setIsEditing(true);
        
        try {
        const response = await fetch(`https://proiect-datc.azurewebsites.net/api/User/edit/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        });
        if (response.ok) {
          console.log('User data updated successfully');
          setUserData(null);
        } else {
          console.error('Failed to update user data');
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      } finally {
        setIsEditing(false);
        closeModal();
      }
    };

  return (
    <div>
      <button className='btn_txt' onClick={fetchUser}>Edit User Data</button>

      {isOpen && (
        <>
        <div className="modal-overlay" onClick={closeModal}></div>
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal-button" onClick={closeModal}>
              &times;
            </span>
            {userData ? (
                <div className='btn_txt'>
                  <p>User ID: {userData.id}</p>
                  <p>CNP: {userData.cnp}</p>
                  <p>Email: {userData.email}</p>
                  <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      id="username"
                      value={userData.username}
                      onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                      type="password"
                      id="password"
                      value={userData.password}
                      onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                      required
                  />
                  </div>
                  <br></br>
                  <button className='btn_txt' onClick={handleEdit} disabled={isEditing}>
                    {isEditing ? 'Editing...' : 'Edit'}
                  </button>
                </div>
              ) : null}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default EditUser;