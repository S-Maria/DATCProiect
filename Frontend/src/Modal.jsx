import React, { useState } from 'react';
import './App.css';
import MapWithPin from './Map';

const ModalForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [lat, setLatitude] = useState(null);
  const [long, setLongitude] = useState(null);
  const [isPinPlaced, setIsPinPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIssue('');
    setIsSubmitting(false);
  };

  const handlePinPlaced = (latitude, longitude) => {
    setLatitude(latitude);
    setLongitude(longitude);
    setIsPinPlaced(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!isPinPlaced) {
        console.log("Please place a pin on the map");
        return;
      }
    
    const currentDate = new Date().toISOString();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No JWT token found');
        return;
      }

      const response = await fetch('https://proiect-datc.azurewebsites.net/api/Report/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          longitude: long,
          latitude: lat,
          date: currentDate,
          type: issue,
        }),
      });

      if (response.ok) {
        console.log('Issue reported successfully');
      } else {
        console.error('Issue reporting failed');
      }
    } catch (error) {
      console.error('Error during issue reporting:', error);
    } finally {
      console.log(`Issue: ${issue}`);
      console.log(`Latitude2: ${lat}, Longitude2: ${long}`);
      setIssue('');
      closeModal();
      setIsPinPlaced(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button className='btn_txt' onClick={openModal}>Report issue</button>

      {isOpen && (
        <>
        <div className="modal-overlay" onClick={closeModal}></div>
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal-button" onClick={closeModal}>
              &times;
            </span>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="issue">Issue:</label>
                <select className='btn_txt'
                    id="issue"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    required
                >
                <option value="" className='btn_txt'>Select an issue</option>
                <option value="Trash" className='btn_txt'>Broken trashcan</option>
                <option value="Broken Light" className='btn_txt'>Broken Light</option>
                <option value="Damaged Building" className='btn_txt'>Damaged Building</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pin">Pin:</label>
                <MapWithPin onPinPlaced={handlePinPlaced}/>
              </div>
              <br></br>
              <button type="submit" className="btn_txt"disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default ModalForm;