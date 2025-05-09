import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { Dropdown } from 'react-bootstrap';
import "./productList.css";
import NavbarTop from "../navbar/NavbarTop";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!["admin", "subadmin", "storekeeper"].includes(user?.role)) {
          setError("You don't have permission to view products");
          setLoading(false);
          return;
        }

        const [productsRes, categoriesRes, warehousesRes] = await Promise.all([
          axios.get("/products"),
          axios.get("/categories"),
          axios.get("/warehouses")
        ]);

        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setWarehouses(warehousesRes.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!activeFilter) {
      setFilteredProducts(products);
      return;
    }

    let result = [...products];
    
    if (filterValue === "all") {
      setFilteredProducts(products);
      return;
    }
    
    if (activeFilter === "category") {
      result = result.filter(product => 
        product.category_id === parseInt(filterValue)
      );
    } else if (activeFilter === "warehouse") {
      result = result.filter(product => 
        product.warehouse_id === parseInt(filterValue)
      );
    } else if (activeFilter === "status") {
      result = result.filter(product => product.status === filterValue);
    }
    
    setFilteredProducts(result);
  }, [activeFilter, filterValue, products]);

  const handleFilterSelect = (filterType) => {
    setActiveFilter(filterType);
    setFilterValue("all");
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const resetFilters = () => {
    setActiveFilter(null);
    setFilterValue("all");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "in-stock": "badge-success",
      "out-of-stock": "badge-danger",
      "low-stock": "badge-warning"
    };
    return <span className={`badge ${statusClasses[status]}`}>{status.replace("-", " ")}</span>;
  };

  const renderFilterInput = () => {
    if (!activeFilter) return null;

    if (activeFilter === "category") {
      return (
        <select
          className="filter-select"
          value={filterValue}
          onChange={handleFilterValueChange}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      );
    }

    if (activeFilter === "warehouse") {
      return (
        <select
          className="filter-select"
          value={filterValue}
          onChange={handleFilterValueChange}
        >
          <option value="all">All Warehouses</option>
          {warehouses.map(warehouse => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
      );
    }

    if (activeFilter === "status") {
      return (
        <select
          className="filter-select"
          value={filterValue}
          onChange={handleFilterValueChange}
        >
          <option value="all">All Statuses</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      );
    }

    return null;
  };

  return (
    <div className="product-list-container">
      <NavbarTop />
      <Navbar />
      <div className="product-list-header">
        <h2>Product Inventory</h2>
        <div className="header-controls">
          <div className="filter-container">
            <div className="filter-group">
              <Dropdown>
                <Dropdown.Toggle variant="primary" className="filter-toggle">
                  {activeFilter ? `Filter by ${activeFilter}` : "Filter by"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="filter-menu">
                  <Dropdown.Item onClick={() => handleFilterSelect("category")}>Category</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterSelect("warehouse")}>Warehouse</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterSelect("status")}>Status</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger" onClick={resetFilters}>Clear Filters</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {renderFilterInput()}
            </div>
          </div>
          <Link to="/product/add" className="btn btn-primary add-product-btn">
            + Add Product
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image_url || "/unknown_product.jpeg"}
                      alt={product.name}
                      className="product-thumbnail"
                      onError={(e) => {
                        e.target.src = "/unknown_product.jpeg";
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name}</td>
                  <td>{product.warehouse?.name}</td>
                  <td>{product.quantity} {product.unit}</td>
                  <td>${product.price}</td>
                  <td>{getStatusBadge(product.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/product/edit/${product.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaRegEdit />
                      </Link>
                      <Link
                        to={`/product/details/${product.id}`}
                        className="btn btn-sm btn-outline-info"
                      >
                        <GrView />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="no-products-message">
              No products found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;