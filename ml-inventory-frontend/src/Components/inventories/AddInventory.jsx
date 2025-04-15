import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const AddInventory = () => {
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: 1,
    movement_type: "in",
    reason: "",
    user_id: ""
  });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes] = await Promise.all([
          axios.get("/products"),
          axios.get("/users")
        ]);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
        
        // Set current user as default
        const user = JSON.parse(localStorage.getItem('user'));
        setFormData(prev => ({ ...prev, user_id: user.id }));
      } catch (err) {
        setError("Failed to fetch products or users");
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

    if (formData.quantity <= 0) {
      setError("Quantity must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/inventory", formData);
      setSuccess("Inventory record added successfully!");
      setTimeout(() => navigate("/inventory/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add inventory record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-inventory">
      <h2>Add Inventory Record</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product*</label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity*</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Movement Type*</label>
          <select
            name="movement_type"
            value={formData.movement_type}
            onChange={handleChange}
            required
          >
            <option value="in">In</option>
            <option value="out">Out</option>
          </select>
        </div>

        <div className="form-group">
          <label>Reason*</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>User*</label>
          <select
            name="user_id"
            value={formData.user_id}
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

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Inventory Record"}
        </button>
      </form>
    </div>
  );
};

export default AddInventory;