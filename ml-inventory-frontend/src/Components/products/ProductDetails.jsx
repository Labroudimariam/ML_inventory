import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./productDetails.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    // Set base path based on user role
    switch (user.role.toLowerCase()) {
      case "admin":
        setBasePath("/admin-dashboard");
        break;
      case "subadmin":
        setBasePath("/subadmin-dashboard");
        break;
      case "storekeeper":
        setBasePath("/storekeeper-dashboard");
        break;
      default:
        setBasePath("");
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
        setSuccess("Product details loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load product details"
        );
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
      "low-stock": "badge-warning",
    };
    return (
      <span className={`badge ${statusClasses[status]}`}>
        {status.replace("-", " ")}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-details-container">
      {/* Success and Error Alerts */}
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      {!product ? (
        <div className="error-message">Product not found</div>
      ) : (
        <>
          <h1>Product Details</h1>

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
              {product.barcode && (
                <div className="barcode-section">
                  <h4>Barcode</h4>
                  <p>{product.barcode}</p>
                </div>
              )}
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
                  <span className="info-value">
                    {product.description || "N/A"}
                  </span>
                </div>
              </div>

              <div className="info-section">
                <h3>Inventory Details</h3>
                <div className="info-row">
                  <span className="info-label">Quantity:</span>
                  <span className="info-value">
                    {product.quantity} {product.unit}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Price:</span>
                  <span className="info-value">${product.price}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Threshold Value:</span>
                  <span className="info-value">
                    {product.threshold_value || "Not set"}
                  </span>
                </div>
              </div>

              <div className="info-section">
                <h3>Additional Information</h3>
                <div className="info-row">
                  <span className="info-label">Expiry Date:</span>
                  <span className="info-value">
                    {product.expiry_date
                      ? new Date(product.expiry_date).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="product-actions">
            <Link
              to={`${basePath}/products/edit/${id}`}
              className="btn btn-primary"
            >
              Edit Product
            </Link>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/products/list`)}
              className="btn btn-secondary"
            >
              Back to Products
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
