import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBoxOpen } from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const OrderItemList = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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

    if (!["admin", "subadmin", "storekeeper"].includes(user?.role)) {
      setError("You don't have permission to view order items");
      setLoading(false);
      return;
    }

    const fetchOrderItems = async () => {
      try {
        const response = await axios.get("/order-items");
        setOrderItems(response.data);
        setSuccess("Order items loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch order items");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrderItems();
  }, []);

  const filteredOrderItems = orderItems.filter(item =>
    item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.order?.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order item?")) {
      try {
        await axios.delete(`/order-items/${id}`);
        setOrderItems(orderItems.filter((item) => item.id !== id));
        setSuccess("Order item deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete order item");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="order-item-list-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="order-item-list-header">
        <h2>
          <FaBoxOpen className="header-icon" /> Order Items
        </h2>
        <div className="header-controls">
          <div className="search-filter">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search order items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to={`${basePath}/order-items/add`} className="btn btn-primary add-order-item-btn">
            <FaPlus /> Add Order Item
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="order-item-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrderItems.length > 0 ? (
              filteredOrderItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={`${basePath}/orders/details/${item.order_id}`}>
                      #{item.order?.order_number || item.order_id}
                    </Link>
                  </td>
                  <td>
                    <Link to={`${basePath}/products/details/${item.product_id}`}>
                      {item.product?.name || 'N/A'}
                    </Link>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unit_price)}</td>
                  <td>{formatCurrency(item.total_price)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${basePath}/order-items/edit/${item.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-sm btn-outline-danger"
                        disabled={!["admin", "subadmin"].includes(JSON.parse(localStorage.getItem("user"))?.role)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No order items found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderItemList;