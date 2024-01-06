import React, { useState } from 'react';
import './App.css';

const EditReport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ReportData, setReportData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [ReportId, setReportId] = useState('');
  const token = localStorage.getItem('token');

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setReportId('');
    setReportData(null);
    setIsCompleting(false);
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
  
    const handleComplete = async () => {
        
        setIsCompleting(true);

        try {
        const response = await fetch(`https://proiect-datc.azurewebsites.net/api/Report/edit/${ReportId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ReportData),
        });
        if (response.ok) {
          console.log('Report completed successfully');
          setReportData(null);
        } else {
          console.error('Failed to complete report');
        }
      } catch (error) {
        console.error('Error completing report:', error);
      } finally {
        setReportId('');
        setIsCompleting(false);
        setReportData(null);
      }
    };

  return (
    <div>
      <button className='btn_txt' onClick={openModal}>Mark Issue as Complete</button>

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
                  <button className='btn_txt' onClick={handleComplete} disabled={isCompleting}>
                    {isCompleting ? 'Completing...' : 'Mark as Complete'}
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

export default EditReport;