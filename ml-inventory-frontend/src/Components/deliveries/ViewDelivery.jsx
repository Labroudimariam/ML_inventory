import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaTruck, 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaUser,
  FaWarehouse,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaEdit,
  FaHistory,
  FaMap,
  FaList
} from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import ErrorAlert from "../alerts/ErrorAlert";
import DeliveryStatusTimeline from "./DeliveryStatusTimeline";
import MapView from "../maps/MapView";
import "./viewDelivery.css";

const ViewDelivery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [basePath, setBasePath] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login to view delivery details");
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

    const fetchDelivery = async () => {
      try {
        const response = await axios.get(`/deliveries/${id}`);
        setDelivery(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch delivery details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDelivery();
  }, [id]);

  const getStatusIcon = () => {
    switch(delivery?.status) {
      case 'draft': return <FaClock className="text-secondary" />;
      case 'validated': return <FaCheckCircle className="text-info" />;
      case 'preparing': return <FaBox className="text-warning" />;
      case 'dispatched': 
      case 'in_transit': 
      case 'out_for_delivery': return <FaTruck className="text-primary" />;
      case 'delivered': return <FaCheckCircle className="text-success" />;
      case 'cancelled': return <FaTimesCircle className="text-danger" />;
      default: return <FaExclamationTriangle className="text-muted" />;
    }
  };

  const getValidationIcon = () => {
    switch(delivery?.validation_status) {
      case 'approved': return <FaCheckCircle className="text-success" />;
      case 'pending': return <FaClock className="text-warning" />;
      case 'rejected': return <FaTimesCircle className="text-danger" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} onClose={() => navigate(`${basePath}/deliveries/list`)} />;
  }

  if (!delivery) {
    return null;
  }

  return (
    <div className="view-delivery-container">
      <div className="delivery-header">
        <button 
          onClick={() => navigate(`${basePath}/deliveries/list`)}
          className="btn btn-back"
        >
          <FaArrowLeft /> Back to Deliveries
        </button>
        
        <div className="header-actions">
          <button
            onClick={() => navigate(`${basePath}/deliveries/edit/${delivery.id}`)}
            className="btn btn-edit"
          >
            <FaEdit /> Edit
          </button>
        </div>
      </div>

      <div className="delivery-title">
        <h2>
          <FaTruck /> Delivery #{delivery.id}
        </h2>
        <div className="status-badge">
          {getStatusIcon()} {delivery.status.replace('_', ' ')}
        </div>
      </div>

      <div className="delivery-tabs">
        <button
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          <FaList /> Details
        </button>
        <button
          className={activeTab === "map" ? "active" : ""}
          onClick={() => setActiveTab("map")}
        >
          <FaMap /> Map View
        </button>
        <button
          className={activeTab === "timeline" ? "active" : ""}
          onClick={() => setActiveTab("timeline")}
        >
          <FaHistory /> Timeline
        </button>
      </div>

      {activeTab === "details" && (
        <div className="delivery-details">
          <div className="details-section">
            <h3>Order Information</h3>
            <div className="detail-row">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">
                {delivery.order?.order_number || 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Beneficiary:</span>
              <span className="detail-value">
                {delivery.order?.beneficiary?.name || 'N/A'}
              </span>
            </div>
          </div>

          <div className="details-section">
            <h3>Delivery Information</h3>
            <div className="detail-row">
              <span className="detail-label">Warehouse:</span>
              <span className="detail-value">
                <FaWarehouse /> {delivery.warehouse?.name || 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Driver:</span>
              <span className="detail-value">
                <FaUser /> {delivery.driver?.name || 'Unassigned'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Validation:</span>
              <span className="detail-value">
                {getValidationIcon()} {delivery.validation_status || 'N/A'}
              </span>
            </div>
            {delivery.validated_by && (
              <div className="detail-row">
                <span className="detail-label">Validated By:</span>
                <span className="detail-value">
                  <FaUser /> {delivery.validator?.name || 'Unknown'}
                </span>
              </div>
            )}
            {delivery.validation_notes && (
              <div className="detail-row">
                <span className="detail-label">Validation Notes:</span>
                <span className="detail-value">
                  {delivery.validation_notes}
                </span>
              </div>
            )}
          </div>

          <div className="details-section">
            <h3>Location Information</h3>
            <div className="detail-row">
              <span className="detail-label">From:</span>
              <span className="detail-value">
                <FaMapMarkerAlt /> {delivery.from_location}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">To:</span>
              <span className="detail-value">
                <FaMapMarkerAlt /> {delivery.to_location}
              </span>
            </div>
            {delivery.current_location && (
              <div className="detail-row">
                <span className="detail-label">Current Location:</span>
                <span className="detail-value">
                  <FaMapMarkerAlt /> {delivery.current_location}
                </span>
              </div>
            )}
          </div>

          <div className="details-section">
            <h3>Timestamps</h3>
            <div className="detail-row">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">
                {formatDate(delivery.created_at)}
              </span>
            </div>
            {delivery.prepared_at && (
              <div className="detail-row">
                <span className="detail-label">Prepared At:</span>
                <span className="detail-value">
                  {formatDate(delivery.prepared_at)}
                </span>
              </div>
            )}
            {delivery.dispatched_at && (
              <div className="detail-row">
                <span className="detail-label">Dispatched At:</span>
                <span className="detail-value">
                  {formatDate(delivery.dispatched_at)}
                </span>
              </div>
            )}
            {delivery.delivered_at && (
              <div className="detail-row">
                <span className="detail-label">Delivered At:</span>
                <span className="detail-value">
                  {formatDate(delivery.delivered_at)}
                </span>
              </div>
            )}
          </div>

          {delivery.delivery_notes && (
            <div className="details-section">
              <h3>Delivery Notes</h3>
              <div className="notes-content">
                {delivery.delivery_notes}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "map" && delivery.from_latitude && delivery.from_longitude && (
        <div className="delivery-map">
          <MapView 
            from={{
              location: delivery.from_location,
              lat: delivery.from_latitude,
              lng: delivery.from_longitude
            }}
            to={{
              location: delivery.to_location,
              lat: delivery.to_latitude,
              lng: delivery.to_longitude
            }}
            current={delivery.current_latitude && delivery.current_longitude ? {
              location: delivery.current_location,
              lat: delivery.current_latitude,
              lng: delivery.current_longitude
            } : null}
          />
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="delivery-timeline">
          <DeliveryStatusTimeline 
            status={delivery.status}
            events={[
              { status: 'draft', timestamp: delivery.created_at },
              { status: 'validated', timestamp: delivery.validated_at },
              { status: 'preparing', timestamp: delivery.prepared_at },
              { status: 'dispatched', timestamp: delivery.dispatched_at },
              { status: 'delivered', timestamp: delivery.delivered_at }
            ].filter(e => e.timestamp)}
          />
        </div>
      )}
    </div>
  );
};

export default ViewDelivery;