import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./detailsOrder.css";

const DetailsOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
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

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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

  if (!order) {
    return (
      <ErrorAlert
        message="Order not found"
        onClose={() => navigate(`${basePath}/orders/list`)}
      />
    );
  }

  return (
    <div className="details-order-container">
      {success && (
        <SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="details-order-header">
        <h2>Order Details: #{order.order_number}</h2>
      </div>

      <div className="details-order-content">
        <div className="details-section">
          <h3>Basic Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">{order.order_number}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value">
                {getStatusBadge(order.status)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{order.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">
                {new Date(order.order_date).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Quantity:</span>
              <span className="detail-value">{order.total_quantity}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3>Associated Parties</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Beneficiary:</span>
              <span className="detail-value">
                {order.beneficiary?.name || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created By:</span>
              <span className="detail-value">
                {order.user?.name || "System"}
              </span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="details-section">
            <h3>Additional Notes</h3>
            <div className="notes-content">{order.notes}</div>
          </div>
        )}

        <div className="details-actions">

          <Link
            to={`${basePath}/orders/edit/${order.id}`}
            className="btn btn-primary"
          >
            Edit Order
          </Link>
                    <button
            onClick={() => navigate(`${basePath}/orders/list`)}
            className="btn btn-secondary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsOrder;
