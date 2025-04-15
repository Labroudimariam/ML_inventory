import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';

const ChangePasswordForm = () => {
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/users/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage('Password changed successfully! Redirecting...');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="password-form">
        <h2>Change Password</h2>
        {message && <div className={`alert ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}

        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="current_password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="new_password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            required
            minLength="8"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="new_password_confirmation"
            value={passwordData.new_password_confirmation}
            onChange={handlePasswordChange}
            required
            minLength="8"
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Update Password</button>
          <button type="button" onClick={() => navigate('/profile')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;