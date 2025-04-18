import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";

import "./productList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      user?.role !== "admin" &&
      user?.role !== "subadmin" &&
      user?.role !== "storekeeper"
    ) {
      setError("You don't have permission to view products");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data);
      } catch (error) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        setError("Failed to delete product.");
      }
    }
  };

  return (
    <div className="product-list">
      <div className="head">
        <h2>Products</h2>
        <Link to="/product/add" className="btn">
          Add New Product
        </Link>
      </div>
      <Navbar />
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-wrapper">
          <div className="table-header">
            <div>Photo</div>
            <div>Name</div>
            <div>Category</div>
            <div>Quantity</div>
            <div>Unit</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {products.map((product) => (
            <div key={product.id} className="table-row">
              <div>
                <div className="profile-container">
                  <img
                    src={
                      product.image
                        ? `http://localhost:8000/storage/${product.image}`
                        : "/unknown_product.jpeg"
                    }
                    alt="Product"
                    className="profile-img"
                  />
                </div>
              </div>
              <div>{product.name}</div>
              <div>{product.category?.name}</div>
              <div>{product.quantity}</div>
              <div>{product.unit}</div>
              <div>{product.status}</div>
              <div className="actions">
                <Link
                  to={`/product/edit/${product.id}`}
                  className="action-button"
                >
                  <FaRegEdit size={18} />
                </Link>
                <Link
                  to={`/product/details/${product.id}`}
                  className="action-button"
                >
                  <GrView  size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="action-button"
                >
                  <FaRegTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
