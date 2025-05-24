import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { FaRegTrashAlt, FaRegEdit,FaPlus } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Dropdown } from 'react-bootstrap';
import "./productList.css";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("all");
  const [basePath, setBasePath] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

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
        setSuccess("Products loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
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
      setCurrentPage(1); // Reset to first page when filters change
      return;
    }

    let result = [...products];
    
    if (filterValue === "all") {
      setFilteredProducts(products);
      setCurrentPage(1); // Reset to first page when filters change
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeFilter, filterValue, products]);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        setSuccess("Product deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-list-container ">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

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
          <Link to={`${basePath}/products/add`} className="btn btn-primary add-product-btn">
            <FaPlus /> Add Product
          </Link>
        </div>
      </div>

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
            {currentProducts.map((product) => (
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
                      to={`${basePath}/products/edit/${product.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <FaRegEdit />
                    </Link>
                    <Link
                      to={`${basePath}/products/details/${product.id}`}
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

     {/* Pagination */}
{filteredProducts.length > productsPerPage && (
  <nav className="pagination-container">
    <ul className="pagination">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
      </li>
      
      {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        </li>
      ))}
      
      <li className={`page-item ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
        >
          <FaChevronRight />
        </button>
      </li>
    </ul>
  </nav>
)}
    </div>
  );
};

export default ProductList;