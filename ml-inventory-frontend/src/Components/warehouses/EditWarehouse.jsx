import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import NavbarTop from "../navbar/NavbarTop";
import Navbar from "../navbar/Navbar";

const EditWarehouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState({
    name: "",
    location: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/warehouses/${id}`);
        setWarehouse(response.data);
      } catch (err) {
        setError("Failed to fetch warehouse data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWarehouse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!warehouse.name) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/warehouses/${id}`, warehouse);
      
      if (response.data) {
        setSuccess("Warehouse updated successfully!");
        setTimeout(() => navigate("/warehouses/list"), 1500);
      } else {
        setError(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to update warehouse");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !warehouse.name) {
    return <div className="text-center my-5">Loading warehouse data...</div>;
  }

  return (
    <div className="container mt-4">
      <NavbarTop />
      <Navbar />
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit Warehouse</h2>
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
                  navigate("/warehouses/list");
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
                  value={warehouse.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={warehouse.location}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={warehouse.description}
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
                    "Update Warehouse"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/warehouses/list")}
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

export default EditWarehouse;