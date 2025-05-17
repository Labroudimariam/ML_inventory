import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./categoryForm.css";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
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

    switch(user.role.toLowerCase()) {
      case 'admin': 
        setBasePath('/admin-dashboard');
        break;
      case 'subadmin': 
        setBasePath('/subadmin-dashboard');
        break;
      default:
        setBasePath('');
    }
  }, []);

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
      await axios.post("/categories", formData);
      setSuccess("Category added successfully!");
      setTimeout(() => navigate(`${basePath}/categories/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to add category");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-form-container">
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Add New Category</h2>

      <form onSubmit={handleSubmit}>
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
            {loading ? "Adding..." : "Add Category"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/categories/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;