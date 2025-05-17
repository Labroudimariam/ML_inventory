import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaTruck, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaPlus, 
  FaFilter,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaUserCheck,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./deliveryList.css";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterValidation, setFilterValidation] = useState("all");
  const [basePath, setBasePath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login to view deliveries");
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
      case 'driver': 
        setBasePath('/driver-dashboard');
        break;
      default:
        setBasePath('');
    }

    const fetchDeliveries = async () => {
      try {
        const endpoint = user.role === 'driver' 
          ? '/deliveries/assigned' 
          : '/deliveries';
        
        const response = await axios.get(endpoint);
        setDeliveries(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch deliveries");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDeliveries();
  }, []);

  const filteredDeliveries = deliveries.filter(delivery => {
    // Search filter
    const matchesSearch = 
      delivery.order?.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.to_location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === "all" || delivery.status === filterStatus;
    
    // Validation filter
    const matchesValidation = filterValidation === "all" || 
      (filterValidation === "validated" && delivery.validation_status === 'approved') ||
      (filterValidation === "pending" && delivery.validation_status === 'pending') ||
      (filterValidation === "rejected" && delivery.validation_status === 'rejected');
    
    return matchesSearch && matchesStatus && matchesValidation;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      draft: "badge-secondary",
      validated: "badge-info",
      preparing: "badge-warning",
      dispatched: "badge-primary",
      in_transit: "badge-info",
      out_for_delivery: "badge-primary",
      delivered: "badge-success",
      cancelled: "badge-danger"
    };
    
    const statusIcons = {
      draft: <FaClock />,
      validated: <FaUserCheck />,
      preparing: <FaBoxOpen />,
      dispatched: <FaTruck />,
      in_transit: <FaTruck />,
      out_for_delivery: <FaTruck />,
      delivered: <FaCheck />,
      cancelled: <FaTimes />
    };
    
    return (
      <span className={`badge ${statusClasses[status]}`}>
        {statusIcons[status]} {status.replace('_', ' ')}
      </span>
    );
  };

  const getValidationBadge = (validation) => {
    const validationClasses = {
      approved: "badge-success",
      pending: "badge-warning",
      rejected: "badge-danger"
    };
    
    const validationIcons = {
      approved: <FaCheck />,
      pending: <FaClock />,
      rejected: <FaTimes />
    };
    
    return (
      <span className={`badge ${validationClasses[validation]}`}>
        {validationIcons[validation]} {validation}
      </span>
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/deliveries/${id}/status`, { status: newStatus });
      setDeliveries(deliveries.map(delivery => 
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      ));
      setSuccess("Delivery status updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        await axios.delete(`/deliveries/${id}`);
        setDeliveries(deliveries.filter(delivery => delivery.id !== id));
        setSuccess("Delivery deleted successfully");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete delivery");
      }
    }
  };

  const handleValidate = async (id) => {
    try {
      await axios.put(`/deliveries/${id}/validate`);
      setDeliveries(deliveries.map(delivery => 
        delivery.id === id ? { 
          ...delivery, 
          validation_status: 'approved',
          status: 'validated',
          validated_by: JSON.parse(localStorage.getItem("user"))?.id,
          validated_at: new Date().toISOString()
        } : delivery
      ));
      setSuccess("Delivery validated successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to validate delivery");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="delivery-list-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="delivery-list-header">
        <h2>
          <FaTruck /> Delivery Management
        </h2>
        <div className="header-controls">
          <div className="search-filter">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="validated">Validated</option>
              <option value="preparing">Preparing</option>
              <option value="dispatched">Dispatched</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={filterValidation}
              onChange={(e) => setFilterValidation(e.target.value)}
            >
              <option value="all">All Validations</option>
              <option value="validated">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <Link to={`${basePath}/deliveries/add`} className="btn btn-primary">
            <FaPlus /> New Delivery
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="delivery-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Recipient</th>
              <th>From → To</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Validation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className={`status-${delivery.status}`}>
                  <td>
                    {delivery.order?.order_number || 'N/A'}
                  </td>
                  <td>{delivery.recipient_name}</td>
                  <td>
                    <div className="location-info">
                      <span className="from-location">
                        <FaMapMarkerAlt /> {delivery.from_location}
                      </span>
                      <span className="to-location">
                        <FaMapMarkerAlt /> {delivery.to_location}
                      </span>
                    </div>
                  </td>
                  <td>
                    {delivery.driver?.name || 'Unassigned'}
                  </td>
                  <td>{getStatusBadge(delivery.status)}</td>
                  <td>{getValidationBadge(delivery.validation_status)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${basePath}/deliveries/view/${delivery.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaEye /> View
                      </Link>
                      <Link
                        to={`${basePath}/deliveries/edit/${delivery.id}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <FaEdit /> Edit
                      </Link>
                      {delivery.status === 'draft' && delivery.requires_validation && (
                        <button
                          onClick={() => handleValidate(delivery.id)}
                          className="btn btn-sm btn-outline-success"
                        >
                          Validate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(delivery.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  <FaExclamationTriangle /> No deliveries found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryList;