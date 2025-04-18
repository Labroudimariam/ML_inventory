import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
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
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await axios.get("/categories");
        setCategories(categoriesRes.data);
        // Fetch warehouses
        const warehousesRes = await axios.get("/warehouses");
        setWarehouses(warehousesRes.data);
      } catch (err) {
        setError("Failed to fetch categories or warehouses");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate quantity and price
    if (formData.quantity < 0 || formData.price < 0) {
      setError("Quantity and price must be positive values");
      setLoading(false);
      return;
    }

    // Ensure warehouse_id is selected
    if (!formData.warehouse_id) {
      setError("Please select a warehouse");
      setLoading(false);
      return;
    }

    // Ensure category_id is selected
    if (!formData.category_id) {
      setError("Please select a category");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      const res = await axios.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setSuccess("Product added successfully!");
      setTimeout(() => navigate("/products/list"), 1500);
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
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Warehouse</label>
          <select
            name="warehouse_id"
            value={formData.warehouse_id}
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
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          >
            <option value="">Select Unit</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="ltr">Liter (ltr)</option>
            <option value="pcs">Pieces (pcs)</option>
            <option value="box">Gram (g)</option>
            <option value="bag">Milliliter (ml)</option>
          </select>
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
          <select name="status" value={formData.status} onChange={handleChange}>
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
