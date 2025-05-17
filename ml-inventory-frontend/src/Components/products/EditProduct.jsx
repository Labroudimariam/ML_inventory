import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import "./productForm.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
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
  const [originalImage, setOriginalImage] = useState("");
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
      setLoading(false);
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
        const [productRes, categoriesRes, warehousesRes] = await Promise.all([
          axios.get(`/products/${id}`),
          axios.get("/categories"),
          axios.get("/warehouses")
        ]);

        setProduct(productRes.data);
        setOriginalImage(productRes.data.image || "");
        setCategories(categoriesRes.data);
        setWarehouses(warehousesRes.data);
        setSuccess("Product data loaded successfully");
        setTimeout(() => setSuccess(""), 3000);

        if (productRes.data.image_url) {
          setImagePreview(productRes.data.image_url);
        }
        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product data");
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

    // Auto-update status based on quantity
    if (name === "quantity") {
      const quantity = parseInt(value) || 0;
      let status = "in-stock";
      if (quantity <= 0) {
        status = "out-of-stock";
      } else if (quantity < product.threshold_value) {
        status = "low-stock";
      }
      setProduct(prev => ({ ...prev, status }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({ ...prev, image: file }));
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
      data.append("_method", "PUT");

      for (const key in product) {
        if (key === "image") {
          if (product.image instanceof File) {
            data.append("image", product.image);
          }
        } else if (product[key] !== null && product[key] !== "") {
          data.append(key, product[key]);
        }
      }

      const response = await axios.post(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccess("Product updated successfully!");
      setTimeout(() => navigate(`${basePath}/products/list`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product.name) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-row">
          <div className="form-group">
            <label>Product Name*</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category*</label>
            <select
              name="category_id"
              value={product.category_id}
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
              value={product.warehouse_id}
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
              value={product.quantity}
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
              value={product.unit}
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
              value={product.price}
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
              value={product.threshold_value}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Barcode</label>
            <input
              type="text"
              name="barcode"
              value={product.barcode}
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
              value={product.status.replace("-", " ")}
              readOnly
              className="status-display"
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={product.expiry_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
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
          {originalImage && !imagePreview.includes("blob:") && (
            <p className="current-image-note">
              Current image: {originalImage.split("/").pop()}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Updating..." : "Update Product"}
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

export default EditProduct;