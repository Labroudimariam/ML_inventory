import React from 'react';
import './loading.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-inner"></div>
      </div>
      <p className='loading-text'>Loading<span className="loading-dots">...</span></p>
    </div>
  );
}

export default LoadingSpinner;