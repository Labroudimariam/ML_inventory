import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    beneficiary_id: "",
    user_id: "",
    order_number: "",
    type: "Semen",
    status: "Processing",
    total_amount: 0,
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: "",
    notes: "",
  });
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, beneficiariesRes, usersRes] = await Promise.all([
          axios.get(`/orders/${id}`),
          axios.get("/beneficiaries"),
          axios.get("/users"),
        ]);

        setOrder({
          ...orderRes.data,
          order_date: orderRes.data.order_date.split("T")[0],
          expected_delivery_date: orderRes.data.expected_delivery_date
            ? orderRes.data.expected_delivery_date.split("T")[0]
            : "",
        });
        setBeneficiaries(beneficiariesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to fetch order data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(`/orders/${id}`, order);
      setSuccess("Order updated successfully!");
      setTimeout(() => navigate("/orders/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order.id) {
    return <div className="text-center my-5">Loading order data...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit Order</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setSuccess("");
                  navigate("/orders/list");
                }}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Order Number*</label>
                <input
                  type="text"
                  className="form-control"
                  name="order_number"
                  value={order.order_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Beneficiary*</label>
                <select
                  className="form-select"
                  name="beneficiary_id"
                  value={order.beneficiary_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Beneficiary</option>
                  {beneficiaries.map((beneficiary) => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                      {beneficiary.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Created By*</label>
                <select
                  className="form-select"
                  name="user_id"
                  value={order.user_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Type*</label>
                <select
                  className="form-select"
                  name="type"
                  value={order.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Semen">Semen</option>
                  <option value="Liquid nitrogen">Liquid Nitrogen</option>
                  <option value="Insemination equipment">Insemination Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Status*</label>
                <select
                  className="form-select"
                  name="status"
                  value={order.status}
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

              <div className="col-md-6">
                <label className="form-label">Order Date*</label>
                <input
                  type="date"
                  className="form-control"
                  name="order_date"
                  value={order.order_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Expected Delivery Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="expected_delivery_date"
                  value={order.expected_delivery_date}
                  onChange={handleChange}
                  min={order.order_date}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Total Amount*</label>
                <input
                  type="number"
                  className="form-control"
                  name="total_amount"
                  min="0"
                  step="0.01"
                  value={order.total_amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  rows="3"
                  value={order.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Update Order"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/orders/list")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;