import React, { useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
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
      const res = await axios.post("/categories", formData);
      setSuccess("Category added successfully!");
      setTimeout(() => navigate("/categories/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category">
      <h2>Add Category</h2>
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
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;