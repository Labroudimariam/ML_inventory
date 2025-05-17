import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./productForm.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    warehouse_id: "",
    quantity: 0,
    unit: "pcs",
    price: 0,
    threshold_value: 0,
    expiry_date: "",
    status: "in-stock",
    description: "",
    barcode: "",
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      return;
    }

    // Set base path based on user role
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

    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, warehousesRes] = await Promise.all([
          axios.get("/categories"),
          axios.get("/warehouses")
        ]);
        setCategories(categoriesRes.data);
        setWarehouses(warehousesRes.data);
        setSuccess("Form data loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load required data");
      } finally {
        setLoading(false);
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

    // Auto-update status based on quantity
    if (name === "quantity") {
      const quantity = parseInt(value) || 0;
      let status = "in-stock";
      if (quantity <= 0) {
        status = "out-of-stock";
      } else if (quantity < formData.threshold_value) {
        status = "low-stock";
      }
      setFormData(prev => ({ ...prev, status }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      }

      const response = await axios.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccess("Product added successfully!");
      setTimeout(() => navigate(`${basePath}/products/list`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !categories.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-row">
          <div className="form-group">
            <label>Product Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category*</label>
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
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Warehouse*</label>
            <select
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity*</label>
            <input
              type="number"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Unit*</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              <option value="pcs">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="g">Grams</option>
              <option value="l">Liters</option>
              <option value="ml">Milliliters</option>
              <option value="box">Box</option>
              <option value="pack">Pack</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price*</label>
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
        </div>

        <div className="form-row">
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
            <label>Barcode</label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <input
              type="text"
              name="status"
              value={formData.status.replace("-", " ")}
              readOnly
              className="status-display"
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
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Product Image</label>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Adding..." : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/products/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;