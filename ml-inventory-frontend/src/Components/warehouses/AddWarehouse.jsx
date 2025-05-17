import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./warehouseForm.css";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const AddWarehouse = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    capacity: "",
    current_stock: "",
    user_id: "",
  });
  const [users, setUsers] = useState([]);
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

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users?role=storekeeper");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching storekeepers:", err);
      }
    };

    fetchUsers();
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

    if (!formData.name) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/warehouses", formData);
      setSuccess("Warehouse added successfully!");
      setTimeout(() => navigate(`${basePath}/warehouses/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to add warehouse");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="warehouse-form-container">
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Add New Warehouse</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Name*</label>
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
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              maxLength="255"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              min="0"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Current Stock</label>
            <input
              type="number"
              name="current_stock"
              min="0"
              value={formData.current_stock}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Storekeeper</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
          >
            <option value="">Select Storekeeper</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            maxLength="500"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Adding..." : "Add Warehouse"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/warehouses/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWarehouse;