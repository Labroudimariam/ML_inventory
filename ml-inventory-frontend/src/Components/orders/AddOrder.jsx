import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./orderForm.css";

const AddOrder = () => {
  const [formData, setFormData] = useState({
    beneficiary_id: "",
    user_id: "",
    order_number: "",
    type: "Semen",
    status: "Pending",
    total_quantity: 0,
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: "",
    notes: ""
  });
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [basePath, setBasePath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
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
        const [beneficiariesRes, usersRes] = await Promise.all([
          axios.get("/beneficiaries"),
          axios.get("/users")
        ]);
        setBeneficiaries(beneficiariesRes.data);
        setUsers(usersRes.data);
        
        // Set current user as default
        setFormData(prev => ({
          ...prev,
          user_id: user.id
        }));
      } catch (err) {
        setError("Failed to fetch required data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateOrderNumber = () => {
    const prefix = "ORD-";
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData(prev => ({
      ...prev,
      order_number: prefix + randomNum
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.beneficiary_id || !formData.order_number || !formData.user_id) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/orders", formData);
      setSuccess("Order created successfully!");
      setTimeout(() => navigate(`${basePath}/orders/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to create order");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !beneficiaries.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="order-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Create New Order</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Order Number*</label>
            <div className="input-group">
              <input
                type="text"
                name="order_number"
                value={formData.order_number}
                onChange={handleChange}
                required
                maxLength="20"
              />
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={generateOrderNumber}
              >
                Generate
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Beneficiary*</label>
            <select
              name="beneficiary_id"
              value={formData.beneficiary_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Beneficiary</option>
              {beneficiaries.map(beneficiary => (
                <option key={beneficiary.id} value={beneficiary.id}>
                  {beneficiary.name} ({beneficiary.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Created By*</label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Order Type*</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Semen">Semen</option>
              <option value="Liquid nitrogen">Liquid Nitrogen</option>
              <option value="Insemination equipment">Insemination Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Order Date*</label>
            <input
              type="date"
              name="order_date"
              value={formData.order_date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expected Delivery Date</label>
            <input
              type="date"
              name="expected_delivery_date"
              value={formData.expected_delivery_date}
              onChange={handleChange}
              min={formData.order_date}
            />
          </div>

          <div className="form-group">
            <label>Total Quantity*</label>
            <input
              type="number"
              name="total_quantity"
              min="0"
              step="1"
              value={formData.total_quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            maxLength="500"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating..." : "Create Order"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/orders/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;