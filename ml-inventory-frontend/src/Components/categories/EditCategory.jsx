import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./categoryForm.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    description: ""
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

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/categories/${id}`);
        setCategory(response.data);
      } catch (err) {
        setError("Failed to fetch category data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({
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
      await axios.put(`/categories/${id}`, category);
      setSuccess("Category updated successfully!");
      setTimeout(() => navigate(`${basePath}/categories/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to update category");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category.name) {
    return <LoadingSpinner />;
  }

  return (
    <div className="category-form-container">
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name*</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
            maxLength="255"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            rows="3"
            maxLength="500"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Updating..." : "Update Category"}
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

export default EditCategory;