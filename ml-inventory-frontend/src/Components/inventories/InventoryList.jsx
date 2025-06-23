import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { FaRegEdit, FaRegTrashAlt, FaPlus, FaArrowUp, FaArrowDown,FaChevronRight, FaChevronLeft  } from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./inventoryList.css";

const InventoryList = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterMovement, setFilterMovement] = useState("all");
  const [basePath, setBasePath] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inventoriesPerPage] = useState(10);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

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
      setError("You don't have permission to view inventory records");
      setLoading(false);
      return;
    }

    const fetchInventories = async () => {
      try {
        const response = await axios.get("/inventory");
        setInventories(response.data);
        setSuccess("Inventory records loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch inventory records");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInventories();
  }, []);

  // Filter inventories by movement type only
  const filteredInventories = inventories.filter(item => {
    return filterMovement === "all" || item.movement_type === filterMovement;
  });

  // Pagination logic
  const indexOfLastInventory = currentPage * inventoriesPerPage;
  const indexOfFirstInventory = indexOfLastInventory - inventoriesPerPage;
  const currentInventories = filteredInventories.slice(indexOfFirstInventory, indexOfLastInventory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inventory record?")) {
      try {
        await axios.delete(`/inventory/${id}`);
        setInventories(inventories.filter((item) => item.id !== id));
        setSuccess("Inventory record deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete inventory record");
      }
    }
  };

  const getMovementbadg = (movementType) => {
    return movementType === "in" ? (
      <span className="badg badg-success">
        <FaArrowUp /> IN
      </span>
    ) : (
      <span className="badg badg-danger">
        <FaArrowDown /> OUT
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="inventory-list-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="inventory-list-header">
        <h2>Inventory Movement Records</h2>
        <div className="header-controls">
          <div className="filter-container">
            <div className="filter-group">
              <select
                className="filter-select"
                value={filterMovement}
                onChange={(e) => setFilterMovement(e.target.value)}
              >
                <option value="all">All Movements</option>
                <option value="in">Inbound Only</option>
                <option value="out">Outbound Only</option>
              </select>
            </div>
          </div>
          {/* <Link to={`${basePath}/inventory/add`} className="btn btn-primary add-inventory-btn">
            <FaPlus /> Add Record
          </Link> */}
        </div>
      </div>

      <div className="table-responsive">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Quantity</th>
              <th>Movement</th>
              <th>Reason</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInventories.length > 0 ? (
              currentInventories.map((item) => (
                <tr key={item.id}>
                  <td>{item.product?.name || 'N/A'}</td>
                  <td>{item.warehouse?.name || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{getMovementbadg(item.movement_type)}</td>
                  <td>{item.reason}</td>
                  <td>{item.user?.name || 'System'}</td>
                  <td>
                    <div className="action-buttons">
                      {/* <Link
                        to={`${basePath}/inventory/edit/${item.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaRegEdit />
                      </Link> */}
                      <button
                        onClick={() => handleDelete(item.id)}
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
                <td colSpan="8" className="no-inventory-message">
                  No inventory records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredInventories.length > inventoriesPerPage && (
        <div className="pagination-container">
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
            
            {Array.from({ length: Math.ceil(filteredInventories.length / inventoriesPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === Math.ceil(filteredInventories.length / inventoriesPerPage) ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredInventories.length / inventoriesPerPage)}
              >
                <FaChevronRight />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InventoryList;