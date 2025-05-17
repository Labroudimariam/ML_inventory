import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");
  const setBasePathBasedOnRole = (role) => {
  switch (role.toLowerCase()) {
    case "admin":
      setBasePath("/admin-dashboard");
      break;
    case "subadmin":
      setBasePath("/subadmin-dashboard");
      break;
    case "storekeeper":
      setBasePath("/storekeeper-dashboard");
      break;
    default:
      setBasePath("");
  }
};

 useEffect(() => {
  const fetchUserProfile = async () => {
    const shouldBypassCache = sessionStorage.getItem("bypassProfileCache") === "true";
    try {
      const cachedProfile = localStorage.getItem("cachedProfile");
      if (cachedProfile && !shouldBypassCache) {
        const parsedProfile = JSON.parse(cachedProfile);
        if (new Date().getTime() - parsedProfile.timestamp < 1000 * 60 * 5) {
          setUser(parsedProfile.data);
          setLoading(false);
          setBasePathBasedOnRole(parsedProfile.data.role);
          return;
        }
      }

      const response = await axios.get("/profile");
      const userData = response.data.user;

      localStorage.setItem(
        "cachedProfile",
        JSON.stringify({
          data: userData,
          timestamp: new Date().getTime(),
        })
      );

      setUser(userData);
      setBasePathBasedOnRole(userData.role);
      setSuccess("Profile loaded successfully");
      setTimeout(() => setSuccess(""), 3000);

      sessionStorage.removeItem("bypassProfileCache"); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  fetchUserProfile();
}, [navigate]);


  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: "badge-primary",
      subadmin: "badge-info",
      storekeeper: "badge-warning",
      user: "badge-secondary",
    };
    return (
      <span className={`badge ${roleClasses[role.toLowerCase()]}`}>{role}</span>
    );
  };

  if (loading && !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-container">
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      {!user ? (
        <div className="error-message">
          User not found. <Link to="/login">Return to login</Link>
        </div>
      ) : (
        <>
          <div className="profile-header">
            <h1>Settings</h1>
            <div className="profile-actions">
              <Link to={`${basePath}/profile/edit`} className="btn btn-primary">
                Edit Profile
              </Link>
              <Link
                to={`${basePath}/profile/change-password`}
                className="btn btn-primary"
              >
                Change Password
              </Link>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-image-section">
              <div className="image-container">
                <img
                  src={user.profile_picture_url || "/unknown_user.jpeg"}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.src = "/unknown_user.jpeg";
                  }}
                />
              </div>
              <div className="profile-basic-info">
                <h2>{user.name}</h2>
                <div className="user-role">
                  <span className="info-label">Role:</span>
                 <span>{getRoleBadge(user.role)}</span> 
                </div>
              </div>
            </div>

            <div className="profile-details">
              <div className="details-section">
                <h3>Personal Information</h3>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                {user.username && (
                  <div className="info-row">
                    <span className="info-label">Username:</span>
                    <span className="info-value">{user.username}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{user.phone}</span>
                  </div>
                )}
                {user.date_of_birth && (
                  <div className="info-row">
                    <span className="info-label">Date of Birth:</span>
                    <span className="info-value">
                      {new Date(user.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="details-section">
                <h3>Address Information</h3>
                {user.address && (
                  <div className="info-row">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{user.address}</span>
                  </div>
                )}
                {user.permanent_address && (
                  <div className="info-row">
                    <span className="info-label">Permanent Address:</span>
                    <span className="info-value">{user.permanent_address}</span>
                  </div>
                )}
                {user.city && (
                  <div className="info-row">
                    <span className="info-label">City:</span>
                    <span className="info-value">{user.city}</span>
                  </div>
                )}
                {user.country && (
                  <div className="info-row">
                    <span className="info-label">Country:</span>
                    <span className="info-value">{user.country}</span>
                  </div>
                )}
                {user.postal_code && (
                  <div className="info-row">
                    <span className="info-label">Postal Code:</span>
                    <span className="info-value">{user.postal_code}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
