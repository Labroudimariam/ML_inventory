import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useParams, Link } from "react-router-dom";
import "./productDetails.css";
import NavbarTop from "../navbar/NavbarTop";
import Navbar from "../navbar/Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      "in-stock": "badge-success",
      "out-of-stock": "badge-danger",
      "low-stock": "badge-warning"
    };
    return <span className={`badge ${statusClasses[status]}`}>{status.replace("-", " ")}</span>;
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  return (
    <div className="product-details-container">
      <NavbarTop />
      <Navbar />
      <h1>Product Details</h1>
      <Link to="/products/list" className="back-link">
        &larr; Back to Products
      </Link>

      <div className="product-details-header">
        <h2>{product.name}</h2>
        <div className="product-status">
          Status: {getStatusBadge(product.status)}
        </div>
      </div>

      <div className="product-details-content">
        <div className="product-image-container">
          <img
             src={product.image_url || "/unknown_product.jpeg"}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = "/unknown_product.jpeg";
            }}
          />
        </div>

        <div className="product-info">
          <div className="info-section">
            <h3>Basic Information</h3>
            <div className="info-row">
              <span className="info-label">Category:</span>
              <span className="info-value">{product.category?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Warehouse:</span>
              <span className="info-value">{product.warehouse?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Description:</span>
              <span className="info-value">{product.description || "N/A"}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Inventory Details</h3>
            <div className="info-row">
              <span className="info-label">Quantity:</span>
              <span className="info-value">{product.quantity} {product.unit}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Price:</span>
              <span className="info-value">${product.price}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Threshold Value:</span>
              <span className="info-value">{product.threshold_value || "Not set"}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Additional Information</h3>
            <div className="info-row">
              <span className="info-label">Expiry Date:</span>
              <span className="info-value">{product.expiry_date || "Not set"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Created At:</span>
              <span className="info-value">
                {new Date(product.created_at).toLocaleString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">
                {new Date(product.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-actions">
        <Link to={`/product/edit/${id}`} className="btn btn-primary">
          Edit Product
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;