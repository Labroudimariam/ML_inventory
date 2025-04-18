import React from 'react';
import './loading.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className='loading'>Loading ...</p>
    </div>
  );
}

export default LoadingSpinner;