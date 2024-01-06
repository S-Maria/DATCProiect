import React, { useState } from 'react';
import './App.css';

const DeleteReport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ReportData, setReportData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ReportId, setReportId] = useState('');
  const token = localStorage.getItem('token');

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setReportId('');
    setReportData(null);
    setIsDeleting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
        const response = await fetch(`https://proiect-datc.azurewebsites.net/api/Report/${ReportId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
          const data = await response.json();
          setReportData(data);
        } else {
          console.error('Failed to fetch report data');
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const handleDelete = async () => {
        
        setIsDeleting(true);

        try {
        const response = await fetch(`https://proiect-datc.azurewebsites.net/api/Report/delete/${ReportId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ReportData),
        });
        if (response.ok) {
          console.log('Report deleted successfully');
          setReportData(null);
        } else {
          console.error('Failed to delete report');
        }
      } catch (error) {
        console.error('Error deleting report:', error);
      } finally {
        setReportId('');
        setIsDeleting(false);
        setReportData(null);
      }
    };

  return (
    <div>
      <button className='btn_txt' onClick={openModal}>Delete Report</button>

      {isOpen && (
        <>
        <div className="modal-overlay" onClick={closeModal}></div>
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal-button" onClick={closeModal}>
              &times;
            </span>
            {ReportData ? (
                <div className='btn_txt'>
                  <p>Report ID: {ReportData.id}</p>
                  <p>Issue: {ReportData.type}</p>
                  <p>Latitude: {ReportData.latitude}</p>
                  <p>Longitude: {ReportData.longitude}</p>
                  <button className='btn_txt' onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="reportId">Enter Report ID:</label>
                    <input
                      type="text"
                      id="reportId"
                      value={ReportId}
                      onChange={(e) => setReportId(e.target.value)}
                      required
                    />
                  </div>
                  <br></br>
                  <button type="submit" className="btn_txt" disabled={isSubmitting}>
                    {isSubmitting ? 'Fetching Report...' : 'Fetch Report'}
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

export default DeleteReport;