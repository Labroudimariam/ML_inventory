import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/beneficiaries/${id}`);
        setBeneficiary(response.data);
      } catch (err) {
        setError("Failed to fetch beneficiary data");
        console.error("Fetch error:", err);
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

    try {
      const response = await axios.put(`/beneficiaries/${id}`, beneficiary);
      
      if (response.data) {
        setSuccess("Beneficiary updated successfully!");
        setTimeout(() => navigate("/beneficiaries/list"), 1500);
      } else {
        setError("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
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
    return <div className="text-center my-5">Loading beneficiary data...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit Beneficiary</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              {success}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => {
                  setSuccess("");
                  navigate("/beneficiaries/list");
                }}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={beneficiary.name}
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
                  value={beneficiary.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone*</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={beneficiary.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender*</label>
                <select
                  className="form-select"
                  name="gender"
                  value={beneficiary.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Address*</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={beneficiary.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">City*</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={beneficiary.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">State*</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={beneficiary.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Country*</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={beneficiary.country}
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
                  value={beneficiary.postal_code}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Number of Artificial Inseminations</label>
                <input
                  type="number"
                  className="form-control"
                  name="nombre_insemination_artificielle"
                  min="0"
                  value={beneficiary.nombre_insemination_artificielle}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Additional Info</label>
                <textarea
                  className="form-control"
                  name="additional_info"
                  value={beneficiary.additional_info}
                  onChange={handleChange}
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
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Beneficiary"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/beneficiaries/list")}
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

export default EditBeneficiary;