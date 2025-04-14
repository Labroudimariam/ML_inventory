import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/categories/${id}`);
        setCategory(response.data);
      } catch (err) {
        setError("Failed to fetch category data");
        console.error("Fetch error:", err);
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
      const response = await axios.put(`/categories/${id}`, category);
      
      if (response.data) {
        setSuccess("Category updated successfully!");
        setTimeout(() => navigate("/categories/list"), 1500);
      } else {
        setError("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
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
    return <div className="text-center my-5">Loading category data...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit Category</h2>
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
                  navigate("/categories/list");
                }}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label">Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={category.description}
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
                    "Update Category"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/categories/list")}
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

export default EditCategory;