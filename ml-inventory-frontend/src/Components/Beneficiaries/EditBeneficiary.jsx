import React, { useState, useEffect } from "react";
import axios from "../../axios";
import {  useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./beneficiaryForm.css";

const EditBeneficiary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState({
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

    const fetchBeneficiary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/beneficiaries/${id}`);
        setBeneficiary(response.data);
      } catch (err) {
        setError("Failed to fetch beneficiary data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBeneficiary();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeneficiary(prev => ({
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
    if (!beneficiary.name || !beneficiary.email || !beneficiary.phone || !beneficiary.address || 
        !beneficiary.city || !beneficiary.state || !beneficiary.country) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`/beneficiaries/${id}`, beneficiary);
      setSuccess("Beneficiary updated successfully!");
      setTimeout(() => navigate(`${basePath}/beneficiaries/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to update beneficiary");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !beneficiary.name) {
    return <LoadingSpinner />;
  }

  return (
    <div className="beneficiary-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Edit Beneficiary</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name*</label>
            <input
              type="text"
              name="name"
              value={beneficiary.name}
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
              value={beneficiary.email}
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
              value={beneficiary.phone}
              onChange={handleChange}
              required
              maxLength="20"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address*</label>
          <textarea
            name="address"
            value={beneficiary.address}
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
              value={beneficiary.city}
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
              value={beneficiary.state}
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
              value={beneficiary.country}
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
              value={beneficiary.postal_code}
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
              value={beneficiary.nombre_insemination_artificielle}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Additional Information</label>
          <textarea
            name="additional_info"
            value={beneficiary.additional_info}
            onChange={handleChange}
            rows="3"
            maxLength="1000"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Updating..." : "Update Beneficiary"}
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

export default EditBeneficiary;