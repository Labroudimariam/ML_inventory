import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import LoadingSpinner from '../loading/Loading';
import SuccessAlert from '../alerts/SuccessAlert';
import ErrorAlert from '../alerts/ErrorAlert';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './changePasswordForm.css';

const ChangePasswordForm = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    old_password: false,
    new_password: false,
    new_password_confirmation: false
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
  
    // Client-side validation
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters long.');
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
        setSuccess('Password changed successfully! Please login again with your new password.');
        
        // Clear user data immediately
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login after showing success message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      if (err.response) {
        // First check for specific error message from backend
        if (err.response.data.message && err.response.data.message.toLowerCase().includes('current password')) {
          setError('Current password is incorrect.');
        } 
        // Then check status codes
        else {
          switch (err.response.status) {
            case 400:
              setError(err.response.data.message || 'Current password is incorrect.');
              break;
            case 401:
              setError('Your session has expired. Please login again.');
              localStorage.removeItem('token');
              setTimeout(() => navigate('/login'), 2000);
              break;
            case 422:
              const validationErrors = err.response.data.errors;
              if (validationErrors) {
                setError(Object.values(validationErrors).flat().join(' '));
              } else {
                setError(err.response.data.message || 'Validation error occurred.');
              }
              break;
            default:
              setError(err.response.data.message || 'An error occurred. Please try again.');
          }
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <h2>Change Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password*</label>
          <div className="password-input-container">
            <input
              type={passwordVisibility.old_password ? "text" : "password"}
              name="old_password"
              value={passwordData.old_password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('old_password')}
              aria-label={passwordVisibility.old_password ? "Hide password" : "Show password"}
            >
              {passwordVisibility.old_password ? <FaEye /> :<FaEyeSlash /> }
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>New Password*</label>
          <div className="password-input-container">
            <input
              type={passwordVisibility.new_password ? "text" : "password"}
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              required
              minLength="8"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('new_password')}
              aria-label={passwordVisibility.new_password ? "Hide password" : "Show password"}
            >
              {passwordVisibility.new_password ? <FaEye /> :<FaEyeSlash /> }
            </button>
          </div>
          <small className="form-text">Must be at least 8 characters long</small>
        </div>

        <div className="form-group">
          <label>Confirm New Password*</label>
          <div className="password-input-container">
            <input
              type={passwordVisibility.new_password_confirmation ? "text" : "password"}
              name="new_password_confirmation"
              value={passwordData.new_password_confirmation}
              onChange={handlePasswordChange}
              required
              minLength="8"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('new_password_confirmation')}
              aria-label={passwordVisibility.new_password_confirmation ? "Hide password" : "Show password"}
            >
              {passwordVisibility.new_password_confirmation ? <FaEye /> :<FaEyeSlash /> }
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
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