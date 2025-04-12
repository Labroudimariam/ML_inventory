import React, { useState, useEffect } from "react";
import axios from "../../axios"; 
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    warehouse: "",
    quantity: 0,
    unit: "",
    price: 0,
    threshold_value: 0,
    expiry_date: "",
    status: "in-stock",
    description: "",
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories and warehouses
    const fetchData = async () => {
      try {
        const [categoriesRes, warehousesRes] = await Promise.all([
          axios.get("/categories"),
          axios.get("/warehouses")
        ]);
        setCategories(categoriesRes.data);
        setWarehouses(warehousesRes.data);
      } catch (err) {
        setError("Failed to fetch required data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (formData.quantity < 0 || formData.price < 0) {
      setError("Quantity and price must be positive values");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setSuccess("Product added successfully!");
      setTimeout(() => navigate("/admin-dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <h2>Add Product</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Warehouse</label>
          <select
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            required
          >
            <option value="">Select Warehouse</option>
            {warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.name}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Unit</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Threshold Value</label>
          <input
            type="number"
            name="threshold_value"
            min="0"
            value={formData.threshold_value}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Status</label>
          <select 
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="low-stock">Low Stock</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;