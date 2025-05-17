import React, { useState, useEffect } from "react";
import axios from "../../axios";
import {  useNavigate } from "react-router-dom";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./beneficiaryForm.css"

const AddBeneficiary = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    additional_info: "",
    nombre_insemination_artificielle: 0
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [basePath, setBasePath] = useState("");
  const navigate = useNavigate();

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || 
        !formData.city || !formData.state || !formData.country) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/beneficiaries", formData);
      setSuccess("Beneficiary added successfully!");
      setTimeout(() => navigate(`${basePath}/beneficiaries/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to add beneficiary");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="beneficiary-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Add New Beneficiary</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength="255"
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
              maxLength="255"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number*</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength="20"
            />
          </div>

          <div className="form-group">
            <label>Gender*</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Address*</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            maxLength="500"
          />
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
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>State/Province*</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              maxLength="100"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Country*</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Postal/Zip Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              maxLength="20"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Artificial Insemination Count</label>
            <input
              type="number"
              name="nombre_insemination_artificielle"
              min="0"
              value={formData.nombre_insemination_artificielle}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Additional Information</label>
          <textarea
            name="additional_info"
            value={formData.additional_info}
            onChange={handleChange}
            rows="3"
            maxLength="1000"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Adding..." : "Add Beneficiary"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/beneficiaries/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBeneficiary;