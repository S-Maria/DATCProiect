import React, { useState } from 'react';
import './App.css';

const LoginForm = ({ onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://proiect-datc.azurewebsites.net/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        
        localStorage.setItem('token', token);

        console.log('Login successful');
        console.log(`User: ${email}, Pw: ${password}`);
        onLogin();
        closeModal();
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button className='btn_txt' onClick={openModal}>Login</button>


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
                <h2>Login</h2>
                <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPw(e.target.value)}
                    required
                  />
              </div>
              <br></br>
              <button type="submit" className="btn_txt" disabled={isSubmitting}>
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

export default LoginForm;