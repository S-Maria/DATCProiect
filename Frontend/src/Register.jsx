import React, { useState } from 'react';
import './App.css';

const RegisterForm = ({ onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUser] = useState("");
  const [password, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [cnp, setCNP] = useState("");
  const [isValidCNP, setIsValidCNP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setIsValidCNP(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const validateCNP = (cnp) => {
    if (cnp.length !== 13) {
      return false;
    }
  
    if (!/^\d+$/.test(cnp)) {
      return false;
    }
  
    const year = parseInt(cnp.substr(1, 2));
    const month = parseInt(cnp.substr(3, 2));
    const day = parseInt(cnp.substr(5, 2));
  
    if (year < 0 || month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
  
    const countyCode = parseInt(cnp.substr(7, 2));
    if (countyCode < 1 || countyCode > 52) {
      return false;
    }
  
    const controlDigit = parseInt(cnp.substr(12, 1));
    const computedControlDigit = computeControlDigit(cnp);
  
    return controlDigit === computedControlDigit;
  };
  
  const computeControlDigit = (cnp) => {
    const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    let sum = 0;
  
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(cnp.charAt(i)) * weights[i];
    }
  
    const remainder = sum % 11;
    return remainder < 10 ? remainder : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!validateCNP(cnp)) {
      console.error('Invalid CNP');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://proiect-datc.azurewebsites.net/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, cnp, password, email }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        
        localStorage.setItem('token', token);

        console.log(`User: ${username}, Pw: ${password}, email: ${email}`);
        onLogin();
        closeModal();
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCNPChange = (e) => {
    const inputValue = e.target.value;
    setCNP(inputValue);
    if (inputValue === '') {
      setIsValidCNP(true);
    } else {
      setIsValidCNP(validateCNP(inputValue));
    }
  };

  return (
    <div>
      <button className='btn_txt' onClick={openModal}>Register</button>


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
                <h2>Register</h2>
                <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />
              </div>
              <div className="form-group">
                <label htmlFor="cnp">CNP:</label>
                  <input
                    type="text"
                    id="cnp"
                    value={cnp}
                    onChange={handleCNPChange}
                    required
                  />
                  {!isValidCNP && <p className='bad'>Invalid CNP</p>}
              </div>
              <div className="form-group">
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
              <button type="submit" className="btn_txt" disabled={isSubmitting || !isValidCNP}>
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

export default RegisterForm;