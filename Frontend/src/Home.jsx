import React, { useState } from 'react';
import './App.css';
import ModalForm from './Modal';
import EditUser from './EditUser';
import ViewMapModal from './ViewMapModal';

const Home = ({ onLogout }) => {
    return (
        <div className="App">
          <ModalForm />
          <br></br>
          <ViewMapModal />
          <br></br>
          <EditUser />
          <br></br>
          <button className='btn_txt' onClick={onLogout}>Logout</button>
        </div>
      );
};

export default Home;
