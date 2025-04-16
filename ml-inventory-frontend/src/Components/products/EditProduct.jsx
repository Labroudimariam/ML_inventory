import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category_id: "",
    warehouse_id: "",
    quantity: 0,
    unit: "",
    price: 0,
    threshold_value: 0,
    expiry_date: "",
    status: "in-stock",
    description: "",
    image: null
  });
  const [initialProduct, setInitialProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, categoriesRes, warehousesRes] = await Promise.all([
          axios.get(`/products/${id}`),
          axios.get("/categories"),
          axios.get("/warehouses")
        ]);

        setProduct(productRes.data);
        setInitialProduct({...productRes.data});
        setCategories(categoriesRes.data);
        setWarehouses(warehousesRes.data);

        if (productRes.data.image) {
          setImagePreview(`http://localhost:8000/storage/${productRes.data.image}`);
        }
      } catch (err) {
        setError("Failed to fetch product data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate required fields
    if (!product.name || !product.category_id || !product.warehouse_id) {
      setError("Name, category and warehouse are required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', product.name);
    formData.append('category_id', product.category_id);
    formData.append('warehouse_id', product.warehouse_id);
    formData.append('quantity', product.quantity);
    formData.append('unit', product.unit);
    formData.append('price', product.price);
    formData.append('threshold_value', product.threshold_value);
    formData.append('expiry_date', product.expiry_date);
    formData.append('status', product.status);
    formData.append('description', product.description);
    
    if (product.image && typeof product.image !== 'string') {
      formData.append('image', product.image);
    }

    try {
      const response = await axios.post(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setSuccess("Product updated successfully!");
        setTimeout(() => navigate("/products/list"), 1500);
      } else {
        setError(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialProduct) {
    return <div className="text-center my-5">Loading product data...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit Product</h2>
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
                  navigate("/products/list");
                }}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Category*</label>
                <select
                  className="form-select"
                  name="category_id"
                  value={product.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Warehouse*</label>
                <select
                  className="form-select"
                  name="warehouse_id"
                  value={product.warehouse_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Quantity*</label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  min="0"
                  value={product.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Unit*</label>
                <input
                  type="text"
                  className="form-control"
                  name="unit"
                  value={product.unit}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Price*</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Threshold Value</label>
                <input
                  type="number"
                  className="form-control"
                  name="threshold_value"
                  min="0"
                  value={product.threshold_value}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="expiry_date"
                  value={product.expiry_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  name="status" 
                  value={product.status} 
                  onChange={handleChange}
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="low-stock">Low Stock</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={product.description}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Image</label>
                {imagePreview && (
                  <div className="mb-3">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="img-thumbnail" 
                      style={{ maxWidth: '200px' }} 
                    />
                  </div>
                )}
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
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
                    "Update Product"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/products/list")}
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

export default EditProduct;