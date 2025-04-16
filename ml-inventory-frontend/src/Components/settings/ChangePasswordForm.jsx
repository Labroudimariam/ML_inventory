import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';

const ChangePasswordForm = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');
  
    // Client-side validation
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError('New password and confirmation do not match.');
      return;
    }
  
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to change your password.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
  
      const response = await axios.put('/user/change-password', passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.success) {
        setSuccessMessage('Password changed successfully! Please login again with your new password.');
        
        // Clear user data immediately
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login after showing success message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        // First check for specific error message from backend
        if (error.response.data.message && error.response.data.message.toLowerCase().includes('current password')) {
          setError('Current password is incorrect.');
        } 
        // Then check status codes
        else {
          switch (error.response.status) {
            case 400:
              setError(error.response.data.message || 'Current password is incorrect.');
              break;
            case 401:
              setSuccessMessage('Password changed successfully!');
              localStorage.removeItem('token');
              setTimeout(() => navigate('/login'), 2000);
              break;
            case 422:
              setError(error.response.data.message || 'Validation error occurred.');
              break;
            default:
              setError(error.response.data.message || 'An error occurred. Please try again.');
          }
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="password-form">
        <h2>Change Password</h2>

        {successMessage && (
          <div className="alert success">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="old_password"
            value={passwordData.old_password}
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;