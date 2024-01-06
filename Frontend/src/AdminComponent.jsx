import React, { useState } from 'react';
import './App.css';
import AdminModal from './AdminModal';
import DeleteUser from './DeleteUser';
import EditReport from './EditReport';
import DeleteReport from './DeleteReport';

const AdminComponent = ({ onLogout }) => {
    return (
        <div className="App">
          <AdminModal />
          <br></br>
          <DeleteUser />
          <br></br>
          <EditReport />
          <br></br>
          <DeleteReport />
          <br></br>
          <button className='btn_txt' onClick={onLogout}>Logout</button>
        </div>
      );
};

export default AdminComponent;
