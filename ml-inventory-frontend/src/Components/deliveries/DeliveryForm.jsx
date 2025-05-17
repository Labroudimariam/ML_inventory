import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaTruck, 
  FaSave, 
  FaTimes, 
  FaMapMarkerAlt,
  FaUser,
  FaWarehouse,
  FaBox,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import MapPicker from "../maps/MapPicker";
import "./deliveryForm.css";

const DeliveryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    order_id: "",
    warehouse_id: "",
    driver_id: "",
    requires_validation: true,
    from_location: "",
    from_latitude: null,
    from_longitude: null,
    to_location: "",
    to_latitude: null,
    to_longitude: null,
    recipient_name: "",
    status: "draft",
    delivery_notes: ""
  });
  
  const [orders, setOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");
  const [mapOpen, setMapOpen] = useState(null); // 'from' or 'to'

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login to manage deliveries");
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
        setLoading(true);
        const [ordersRes, warehousesRes, driversRes] = await Promise.all([
          axios.get("/orders?deliverable=true"),
          axios.get("/warehouses"),
          axios.get("/users?role=driver")
        ]);

        setOrders(ordersRes.data);
        setWarehouses(warehousesRes.data);
        setDrivers(driversRes.data);

        if (id) {
          const deliveryRes = await axios.get(`/deliveries/${id}`);
          setFormData(deliveryRes.data);
        } else {
          // Set default warehouse if user has one assigned
          if (user.warehouse_id) {
            const warehouse = warehousesRes.data.find(w => w.id === user.warehouse_id);
            if (warehouse) {
              setFormData(prev => ({
                ...prev,
                warehouse_id: warehouse.id,
                from_location: warehouse.location,
                from_latitude: warehouse.latitude,
                from_longitude: warehouse.longitude
              }));
            }
          }
        }
      } catch (err) {
        setError("Failed to fetch required data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationSelect = (location, lat, lng) => {
    if (mapOpen === 'from') {
      setFormData(prev => ({
        ...prev,
        from_location: location,
        from_latitude: lat,
        from_longitude: lng
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        to_location: location,
        to_latitude: lat,
        to_longitude: lng
      }));
    }
    setMapOpen(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.order_id || !formData.warehouse_id) {
      setError("Please select both order and warehouse");
      setLoading(false);
      return;
    }

    if (!formData.to_location || !formData.recipient_name) {
      setError("Please provide destination and recipient information");
      setLoading(false);
      return;
    }

    try {
      if (id) {
        await axios.put(`/deliveries/${id}`, formData);
        setSuccess("Delivery updated successfully!");
      } else {
        await axios.post("/deliveries", formData);
        setSuccess("Delivery created successfully!");
      }
      setTimeout(() => navigate(`${basePath}/deliveries/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to save delivery");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.id && id) {
    return <LoadingSpinner />;
  }

  return (
    <div className="delivery-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="delivery-form-header">
        <h2>
          <FaTruck /> {id ? "Edit Delivery" : "Create New Delivery"}
        </h2>
        <button
          onClick={() => navigate(`${basePath}/deliveries/list`)}
          className="btn btn-back"
        >
          <FaTimes /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="delivery-form">
        <div className="form-row">
          <div className="form-group">
            <label>
              <FaBox /> Order*
            </label>
            <select
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              required
              disabled={!!id}
            >
              <option value="">Select Order</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  #{order.order_number} - {order.beneficiary?.name || 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <FaWarehouse /> Warehouse*
            </label>
            <select
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.location})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <FaUser /> Driver
            </label>
            <select
              name="driver_id"
              value={formData.driver_id}
              onChange={handleChange}
            >
              <option value="">Select Driver</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <FaCheckCircle /> Requires Validation
            </label>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="requires_validation"
                checked={formData.requires_validation}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>
            <FaMapMarkerAlt /> From Location*
          </label>
          <div className="location-input-group">
            <input
              type="text"
              name="from_location"
              value={formData.from_location}
              onChange={handleChange}
              required
              readOnly
            />
            <button
              type="button"
              onClick={() => setMapOpen('from')}
              className="btn btn-map"
            >
              Select on Map
            </button>
          </div>
          {formData.from_latitude && formData.from_longitude && (
            <div className="coordinates">
              Lat: {formData.from_latitude}, Lng: {formData.from_longitude}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            <FaMapMarkerAlt /> To Location (Destination)*
          </label>
          <div className="location-input-group">
            <input
              type="text"
              name="to_location"
              value={formData.to_location}
              onChange={handleChange}
              required
              readOnly
            />
            <button
              type="button"
              onClick={() => setMapOpen('to')}
              className="btn btn-map"
            >
              Select on Map
            </button>
          </div>
          {formData.to_latitude && formData.to_longitude && (
            <div className="coordinates">
              Lat: {formData.to_latitude}, Lng: {formData.to_longitude}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Recipient Name*</label>
            <input
              type="text"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
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
        </div>

        <div className="form-group">
          <label>Delivery Notes</label>
          <textarea
            name="delivery_notes"
            value={formData.delivery_notes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Delivery"} <FaSave />
          </button>
        </div>
      </form>

      {mapOpen && (
        <div className="map-modal">
          <div className="map-container">
            <MapPicker 
              onSelect={handleLocationSelect}
              onClose={() => setMapOpen(null)}
              initialLocation={
                mapOpen === 'from' ? 
                  { lat: formData.from_latitude, lng: formData.from_longitude } :
                  { lat: formData.to_latitude, lng: formData.to_longitude }
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;