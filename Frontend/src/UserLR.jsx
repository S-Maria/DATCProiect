import React, { useState } from 'react';
import './App.css';
import LoginForm from './Login';
import RegisterForm from './Register';

const UserLR = ({ onLogin }) => {
    return (
        <div className="App">
          <LoginForm onClick={onLogin}/>
          <br></br>
          <RegisterForm onClick={onLogin}/>
        </div>
      );
};

export default UserLR;
