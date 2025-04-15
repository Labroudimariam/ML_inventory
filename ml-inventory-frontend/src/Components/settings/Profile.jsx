import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/profile');
        setUser(response.data.user);
      } catch (error) {
        setMessage('Failed to fetch profile data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>

      {message && <div className="alert">{message}</div>}

      <div className="profile-content">

      <div className="profile-actions">
          <Link to="/profile/edit" className="btn btn-primary">
            Edit Profile
          </Link>
          <Link to="/profile/change-password" className="btn btn-secondary">
            Change Password
          </Link>
        </div>
        
        <div className="profile-info">
          <div className="profile-picture">
            <img width={150} height={150}
              src={
                user.profile_picture
                  ? `http://localhost:8000/storage/${user.profile_picture}`
                  : '/images/default-profile.png'
              }
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-profile.png';
              }}
            />
          </div>

          <div className="profile-details">
            <h2>{user.name}</h2>
            <p><span>Role:</span> {user.role}</p>
            <p><span>Email:</span> {user.email}</p>
            <p><span>Username:</span> {user.username}</p>
            <p><span>Date of Birth:</span> {new Date(user.date_of_birth).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="additional-info">
          <h3>Additional Information</h3>
          <div className="info-grid">
            <div>
              <p><span>Address:</span> {user.address}</p>
              {user.permanent_address && (
                <p><span>Permanent Address:</span> {user.permanent_address}</p>
              )}
            </div>
            <div>
              <p><span>City:</span> {user.city}</p>
              <p><span>Country:</span> {user.country}</p>
              {user.postal_code && (
                <p><span>Postal Code:</span> {user.postal_code}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;