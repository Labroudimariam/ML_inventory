import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/beneficiaries", formData);
      setSuccess("Beneficiary added successfully!");
      setTimeout(() => navigate("/beneficiaries/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add beneficiary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-beneficiary">
      <h2>Add Beneficiary</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label>Phone*</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
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

        <div className="form-group">
          <label>Address*</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

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
          <label>State*</label>
          <input
            type="text"
            name="state"
            value={formData.state}
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
          <label>Additional Info</label>
          <textarea
            name="additional_info"
            value={formData.additional_info}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Number of Artificial Inseminations</label>
          <input
            type="number"
            name="nombre_insemination_artificielle"
            min="0"
            value={formData.nombre_insemination_artificielle}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Beneficiary"}
        </button>
      </form>
    </div>
  );
};

export default AddBeneficiary;