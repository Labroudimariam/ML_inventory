import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useParams, Link } from "react-router-dom";
import "./productDetails.css"; 

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-details">
      <Link to="/products" className="back-link">← Back to Products</Link>
      <h2>Product Details</h2>
      {product && (
        <div className="details-card">
          <img
            src={
              product.image
                ? `http://localhost:8000/storage/${product.image}`
                : "/unknown_product.jpeg"
            }
            alt={product.name}
            className="details-image"
          />
          <div className="details-info">
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>Category:</strong> {product.category?.name}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
            <p><strong>Unit:</strong> {product.unit}</p>
            <p><strong>Price</strong>{product.price}</p>
            <p><strong>Warehouse:</strong>{product.warehouse?.name}</p>
            <p><strong>Status:</strong> {product.status}</p>
            <p><strong>Threshold Value:</strong> {product.threshold_value}</p>
            <p><strong>Expiry Date:</strong> {product.expiry_date}</p>
            <p><strong>Description:</strong> {product.description}</p>

            {/* Add more fields as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
