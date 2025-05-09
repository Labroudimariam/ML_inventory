import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import NavbarTop from "../navbar/NavbarTop";
import Navbar from "../navbar/Navbar";

const AddOrder = () => {
  const [formData, setFormData] = useState({
    beneficiary_id: "",
    user_id: "",
    order_number: "",
    type: "Semen",
    status: "Processing",
    total_amount: 0,
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: "",
    notes: ""
  });
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [beneficiariesRes, usersRes] = await Promise.all([
          axios.get("/beneficiaries"),
          axios.get("/users")
        ]);
        setBeneficiaries(beneficiariesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to fetch required data");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/orders", formData);
      setSuccess("Order added successfully!");
      setTimeout(() => navigate("/orders/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-order">
      <NavbarTop />
      <Navbar />
      <h2>Add Order</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Number*</label>
          <input
            type="text"
            name="order_number"
            value={formData.order_number}
            onChange={handleChange}
            required
          />
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
                {beneficiary.name}
              </option>
            ))}
          </select>
        </div>

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
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type*</label>
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

        <div className="form-group">
          <label>Status*</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
            <option value="On Hold">On Hold</option>
            <option value="In Transit">In Transit</option>
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
          />
        </div>

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
          <label>Total Amount*</label>
          <input
            type="number"
            name="total_amount"
            min="0"
            step="0.01"
            value={formData.total_amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Order"}
        </button>
      </form>
    </div>
  );
};

export default AddOrder;