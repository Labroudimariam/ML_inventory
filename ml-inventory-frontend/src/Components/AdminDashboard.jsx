import React, { useState, useEffect } from 'react';
import Navbar from './navbar/Navbar';
import NavbarTop from './navbar/NavbarTop'; 
import './adminDashboard.css';

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`admin-dashboard`}>
      <NavbarTop isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <h1>Admin Dashboard</h1>
      <Navbar />
      <div className="dashboard-content">
        {/* Your dashboard content components */}
      </div>
    </div>
  );
};

export default AdminDashboard;
