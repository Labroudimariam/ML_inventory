import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { FaRegTrashAlt, FaRegEdit, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./warehouseList.css";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [warehousesPerPage] = useState(10);

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

    if (!["admin", "subadmin", "storekeeper"].includes(user?.role)) {
      setError("You don't have permission to view warehouses");
      setLoading(false);
      return;
    }

    const fetchWarehouses = async () => {
      try {
        const response = await axios.get("/warehouses");
        setWarehouses(response.data);
        setSuccess("Warehouses loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch warehouses");
      } finally {
        setLoading(false);
      }
    };
  
    fetchWarehouses();
  }, []);

  // Get current warehouses
  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = warehouses.slice(indexOfFirstWarehouse, indexOfLastWarehouse);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      try {
        await axios.delete(`/warehouses/${id}`);
        setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
        setSuccess("Warehouse deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete warehouse. Make sure no products are associated with it.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="warehouse-list-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="warehouse-list-header">
        <h2>Warehouses</h2>
        <div className="header-controls">
          <Link to={`${basePath}/warehouses/add`} className="btn btn-primary add-warehouse-btn">
            <FaPlus /> Add Warehouse
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
              <th>Capacity</th>
              <th>Current Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentWarehouses.length > 0 ? (
              currentWarehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.location || "N/A"}</td>
                  <td>{warehouse.description || "N/A"}</td>
                  <td>{warehouse.capacity || "N/A"}</td>
                  <td>{warehouse.current_stock || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${basePath}/warehouses/edit/${warehouse.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaRegEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(warehouse.id)}
                        className="btn btn-sm btn-outline-danger"
                        disabled={!["admin", "subadmin"].includes(JSON.parse(localStorage.getItem("user"))?.role)}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No warehouses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {warehouses.length > warehousesPerPage && (
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
            
            {Array.from({ length: Math.ceil(warehouses.length / warehousesPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === Math.ceil(warehouses.length / warehousesPerPage) ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(warehouses.length / warehousesPerPage)}
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

export default WarehouseList;