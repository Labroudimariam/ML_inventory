import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import { FaRegTrashAlt, FaRegEdit, FaPlus } from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./orderList.css";
import { GrView } from "react-icons/gr";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [basePath, setBasePath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

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

    if (!["admin", "subadmin", "storekeeper"].includes(user?.role)) {
      setError("You don't have permission to view orders");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
        setSuccess("Orders loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesType = filterType === "all" || order.type === filterType;
    return matchesStatus && matchesType;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`/orders/${id}`);
        setOrders(orders.filter((order) => order.id !== id));
        setSuccess("Order deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete order");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: "badge-warning",
      Approved: "badge-info",
      Processing: "badge-primary",
      Completed: "badge-success",
      Rejected: "badge-danger",
    };
    return <span className={`badge ${statusClasses[status]}`}>{status}</span>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="order-list-container">
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="order-list-header">
        <h2>Orders Management</h2>
        <div className="header-controls">
          <div className="filter-container">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Semen">Semen</option>
              <option value="Liquid nitrogen">Liquid Nitrogen</option>
              <option value="Insemination equipment">Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Link
            to={`${basePath}/order/add`}
            className="btn btn-primary add-order-btn"
          >
            <FaPlus /> Create Order
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Beneficiary</th>
              <th>Created By</th>
              <th>Type</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Total Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>
                      {order.beneficiary?.name}
                  </td>
                  <td>{order.user?.name || "System"}</td>
                  <td>{order.type}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{order.total_quantity}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${basePath}/order/edit/${order.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaRegEdit />
                      </Link>
                      <Link
                        to={`${basePath}/order/details/${order.id}`}
                        className="btn btn-sm btn-outline-info"
                      >
                        <GrView />
                      </Link>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="btn btn-sm btn-outline-danger"
                        disabled={
                          !["admin", "subadmin"].includes(
                            JSON.parse(localStorage.getItem("user"))?.role
                          )
                        }
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No orders found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
