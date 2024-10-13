// src/layouts/MainLayout.js
import React from 'react';
import Navbar from '../components/Navbar';
import  './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
