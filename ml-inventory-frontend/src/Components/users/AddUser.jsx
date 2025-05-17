import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./userForm.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    cin: "",
    gender: "",
    password: "",
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      return;
    }

    // Set base path based on user role
    switch(user.role.toLowerCase()) {
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
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_picture: file }));
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
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      const response = await axios.post("/users", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("User added successfully!");
      setTimeout(() => navigate(`${basePath}/users/list`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-container">
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}

      <h2>Add New User</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-row">
          <div className="form-group">
            <label>Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone*</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
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
              value={formData.cin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
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
            <label>Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth*</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
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
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Permanent Address</label>
            <input
              type="text"
              name="permanent_address"
              value={formData.permanent_address}
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
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Country*</label>
            <input
              type="text"
              name="country"
              value={formData.country}
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
              value={formData.postal_code}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Role*</label>
            <select
              name="role"
              value={formData.role}
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

        {formData.role === "driver" && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Driver License Number*</label>
                <input
                  type="text"
                  name="driver_license_number"
                  value={formData.driver_license_number}
                  onChange={handleChange}
                  required={formData.role === "driver"}
                />
              </div>

              <div className="form-group">
                <label>Vehicle Type*</label>
                <input
                  type="text"
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  required={formData.role === "driver"}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Registration*</label>
                <input
                  type="text"
                  name="vehicle_registration"
                  value={formData.vehicle_registration}
                  onChange={handleChange}
                  required={formData.role === "driver"}
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
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Adding..." : "Add User"}
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

export default AddUser;