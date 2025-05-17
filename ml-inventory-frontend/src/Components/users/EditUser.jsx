import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import "./userForm.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    cin: "",
    gender: "",
    date_of_birth: "",
    address: "",
    permanent_address: "",
    city: "",
    country: "",
    postal_code: "",
    role: "storekeeper",
    driver_license_number: "",
    vehicle_type: "",
    vehicle_registration: "",
    profile_picture: null,
  });
  const [originalImage, setOriginalImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      setError("User not authenticated");
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

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/users/${id}`);

        setUser(response.data);
        setOriginalImage(response.data.profile_picture || "");
        setSuccess("User data loaded successfully");
        setTimeout(() => setSuccess(""), 3000);

        if (response.data.profile_picture) {
          setImagePreview(
            `http://localhost:8000/storage/${response.data.profile_picture}`
          );
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser(prev => ({
        ...prev,
        profile_picture: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("_method", "PUT");

      Object.entries(user).forEach(([key, value]) => {
        if (key === "profile_picture") {
          if (user.profile_picture instanceof File) {
            data.append("profile_picture", user.profile_picture);
          }
        } else if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      const response = await axios.post(`/users/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess("User updated successfully!");
      setTimeout(() => navigate(`${basePath}/users/list`), 2000);
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors)
          .flat()
          .join(", ");
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to update user");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user.name) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-form-container">
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}

      <h2>Edit User</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            <label>Phone*</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>CIN*</label>
            <input
              type="text"
              name="cin"
              value={user.cin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Permanent Address</label>
            <input
              type="text"
              name="permanent_address"
              value={user.permanent_address}
              onChange={handleChange}
            />
          </div>

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
        </div>

        <div className="form-row">
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

        <div className="form-row">
          <div className="form-group">
            <label>Role*</label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="subadmin">Sub Admin</option>
              <option value="storekeeper">Storekeeper</option>
              <option value="driver">Driver</option>
            </select>
          </div>
        </div>

        {user.role === "driver" && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Driver License Number*</label>
                <input
                  type="text"
                  name="driver_license_number"
                  value={user.driver_license_number}
                  onChange={handleChange}
                  required={user.role === "driver"}
                />
              </div>

              <div className="form-group">
                <label>Vehicle Type*</label>
                <input
                  type="text"
                  name="vehicle_type"
                  value={user.vehicle_type}
                  onChange={handleChange}
                  required={user.role === "driver"}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Registration*</label>
                <input
                  type="text"
                  name="vehicle_registration"
                  value={user.vehicle_registration}
                  onChange={handleChange}
                  required={user.role === "driver"}
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Profile Picture</label>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
          <input
            type="file"
            name="profile_picture"
            onChange={handleFileChange}
            accept="image/*"
          />
          {originalImage && !imagePreview.includes("blob:") && (
            <p className="current-image-note">
              Current image: {originalImage.split("/").pop()}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Updating..." : "Update User"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/users/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;