import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./userDetails.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    // Set base path based on user role
    switch (user.role.toLowerCase()) {
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

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${id}`);
        setUser(response.data);
        setSuccess("User details loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load user details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const getRoleBadge = (role) => {
    const roleClasses = {
      "admin": "badge-primary",
      "subadmin": "badge-info",
      "storekeeper": "badge-warning",
      "user": "badge-secondary"
    };
    return <span className={`badge ${roleClasses[role]}`}>{role}</span>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-details-container">
      {/* Success and Error Alerts */}
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      {!user ? (
        <div className="error-message">User not found</div>
      ) : (
        <>
          <h1>User Details</h1>

          <div className="user-details-header">
            <h2>{user.name}</h2>
            <div className="user-role">
              Role: {getRoleBadge(user.role)}
            </div>
          </div>

          <div className="user-details-content">
            <div className="user-image-container">
              <img
                src={user.profile_picture_url || "/unknown_user.jpeg"}
                alt="Profile"
                className="user-image"
                onError={(e) => {
                  e.target.src = "/unknown_user.jpeg";
                }}
              />
              {user.username && (
                <div className="username-section">
                  <h4>Username</h4>
                  <p>{user.username}</p>
                </div>
              )}
            </div>

            <div className="user-info">
              <div className="info-section">
                <h3>Personal Information</h3>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email Verified:</span>
                  <span className="info-value">
                    {user.email_verified_at ? "Yes" : "No"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{user.phone || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">{user.gender || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date of Birth:</span>
                  <span className="info-value">{user.date_of_birth || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">CIN:</span>
                  <span className="info-value">{user.cin || "N/A"}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>Address Information</h3>
                <div className="info-row">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{user.address || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Permanent Address:</span>
                  <span className="info-value">{user.permanent_address || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">City:</span>
                  <span className="info-value">{user.city || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Country:</span>
                  <span className="info-value">{user.country || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Postal Code:</span>
                  <span className="info-value">{user.postal_code || "N/A"}</span>
                </div>
              </div>

              {user.is_driver ? (
                <div className="info-section">
                  <h3>Driver Information</h3>
                  <div className="info-row">
                    <span className="info-label">Driver License #:</span>
                    <span className="info-value">{user.driver_license_number}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Vehicle Type:</span>
                    <span className="info-value">{user.vehicle_type}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Vehicle Registration:</span>
                    <span className="info-value">{user.vehicle_registration}</span>
                  </div>
                </div>
              ):""}
            </div>
          </div>

          <div className="user-actions">
            <Link
              to={`${basePath}/user/edit/${id}`}
              className="btn btn-primary"
            >
              Edit User
            </Link>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/users/list`)}
              className="btn btn-secondary"
            >
              Back to Users
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;