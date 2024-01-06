import React, { useState } from 'react';
import './App.css';

const DeleteUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem('token');

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setUserId('');
    setUserData(null);
    setIsDeleting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
        const response = await fetch(`https://proiect-datc.azurewebsites.net/api/User/details/${userId}`, {
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
        setIsSubmitting(false);
      }
    };
  
    const handleDelete = async () => {
        
        setIsDeleting(true);

        try {
        const response = await fetch(`https://proiect-datc.azurewebsites.net/api/User/delete/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          console.log('User deleted successfully');
          setUserData(null);
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setUserId('');
        setIsDeleting(false);
        setUserData(null);
      }
    };

  return (
    <div>
      <button className='btn_txt' onClick={openModal}>Delete User</button>

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
                  <p>Name: {userData.username}</p>
                  <p>CNP: {userData.cnp}</p>
                  <p>Role: {userData.role}</p>
                  <button className='btn_txt' onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="userId">Enter User ID:</label>
                    <input
                      type="text"
                      id="userId"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                    />
                  </div>
                  <br></br>
                  <button type="submit" className="btn_txt" disabled={isSubmitting}>
                    {isSubmitting ? 'Fetching User...' : 'Fetch User'}
                  </button>
                </form>
              )}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default DeleteUser;