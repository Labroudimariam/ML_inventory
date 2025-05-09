import React, { useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import NavbarTop from "../navbar/NavbarTop";
import Navbar from "../navbar/Navbar";

const AddUser = () => {
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
    is_driver: false,
    driver_license_number: "",
    vehicle_type: "",
    vehicle_registration: "",
    profile_picture: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profile_picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        // Ensure is_driver is sent as a proper boolean (not string)
        if (key === 'is_driver') {
          data.append(key, value ? "1" : "0"); // Some backends expect "1"/"0"
          // OR (if backend expects true/false as raw boolean)
          // data.append(key, value);
        } else {
          data.append(key, value);
        }
      }
    });
  
    // DEBUG: Log the FormData before sending
    for (let [key, val] of data.entries()) {
      console.log(key, val);
    }
  
    try {
      const res = await axios.post("/users", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("User added successfully!");
      setTimeout(() => navigate("/users/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <NavbarTop />
      <Navbar />
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Add User</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email*</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Username*</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone*</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">CIN*</label>
                <input
                  type="text"
                  className="form-control"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
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

              <div className="col-md-6">
                <label className="form-label">Password*</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth*</label>
                <input
                  type="date"
                  className="form-control"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Address*</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Permanent Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">City*</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Country*</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Role*</label>
                <select
                  className="form-select"
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

              <div className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_driver"
                    checked={formData.is_driver}
                    onChange={handleChange}
                    id="isDriverCheck"
                  />
                  <label className="form-check-label" htmlFor="isDriverCheck">
                    Is Driver
                  </label>
                </div>
              </div>

              {formData.is_driver && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Driver License Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="driver_license_number"
                      value={formData.driver_license_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Vehicle Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Vehicle Registration</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vehicle_registration"
                      value={formData.vehicle_registration}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="col-12">
                <label className="form-label">Profile Picture</label>
                <input
                  type="file"
                  className="form-control"
                  name="profile_picture"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    "Add User"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/users/list")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
