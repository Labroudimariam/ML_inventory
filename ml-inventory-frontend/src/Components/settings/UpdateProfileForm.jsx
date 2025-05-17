import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import './updateProfileForm.css';
import LoadingSpinner from '../loading/Loading';
import SuccessAlert from '../alerts/SuccessAlert';
import ErrorAlert from '../alerts/ErrorAlert';

const UpdateProfileForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    date_of_birth: '',
    address: '',
    permanent_address: '',
    city: '',
    country: '',
    postal_code: '',
    profile_picture: null
  });
  const [originalImage, setOriginalImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [basePath, setBasePath] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    // Set base path based on user role
    switch(currentUser.role.toLowerCase()) {
      case 'admin': 
        setBasePath('/admin-dashboard');
        break;
      case 'subadmin': 
        setBasePath('/subadmin-dashboard');
        break;
      case 'storekeeper': 
        setBasePath('/storekeeper-dashboard');
        break;
      default:
        setBasePath('');
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/profile');
        
        setUser(response.data.user);
        setOriginalImage(response.data.user.profile_picture || '');

        if (response.data.user.profile_picture) {
          setImagePreview(`http://localhost:8000/storage/${response.data.user.profile_picture}`);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser(prev => ({
        ...prev,
        profile_picture: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('username', user.username);
      formData.append('date_of_birth', user.date_of_birth);
      formData.append('address', user.address);
      formData.append('permanent_address', user.permanent_address || '');
      formData.append('city', user.city);
      formData.append('country', user.country);
      formData.append('postal_code', user.postal_code || '');
      
      if (user.profile_picture && typeof user.profile_picture !== 'string') {
        formData.append('profile_picture', user.profile_picture);
      }

      const response = await axios.post(`/users/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        sessionStorage.setItem("bypassProfileCache", "true");
        setSuccess('Profile updated successfully!');
        setTimeout(() => navigate(`${basePath}/settings`), 1500);
      } else {
        setError(response.data.message || 'Update failed');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user.name) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-row">
          <div className="form-group">
            <label>Profile Picture</label>
            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                />
              </div>
            )}
            <input
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              accept="image/*"
            />
            {originalImage && !imagePreview.includes('blob:') && (
              <p className="current-image-note">
                Current image: {originalImage.split('/').pop()}
              </p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Name*</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Username*</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth*</label>
            <input
              type="date"
              name="date_of_birth"
              value={user.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Address*</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Permanent Address</label>
            <input
              type="text"
              name="permanent_address"
              value={user.permanent_address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City*</label>
            <input
              type="text"
              name="city"
              value={user.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Country*</label>
            <input
              type="text"
              name="country"
              value={user.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={user.postal_code}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/settings`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;