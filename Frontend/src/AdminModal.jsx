import React, { useState } from 'react';
import './App.css';
import AdminMap from './AdminMap';

const AdminModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button className='btn_txt' onClick={openModal}>View Issues Map</button>

      {isOpen && (
        <>
        <div className="modal-overlay" onClick={closeModal}></div>
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal-button" onClick={closeModal}>
              &times;
            </span>
              <div className="form-group">
                <label htmlFor="issue">Issues</label>
              </div>
              <div className="form-group">
                  <AdminMap/>
                  <br></br>
              </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default AdminModal;