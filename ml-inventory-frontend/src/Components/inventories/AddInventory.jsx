import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./inventoryForm.css";

const AddInventory = () => {
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 1,
    movement_type: "in",
    reason: "",
    user_id: ""
  });
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
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
        const [productsRes, warehousesRes, usersRes] = await Promise.all([
          axios.get("/products"),
          axios.get("/warehouses"),
          axios.get("/users")
        ]);
        setProducts(productsRes.data);
        setWarehouses(warehousesRes.data);
        setUsers(usersRes.data);
        
        // Set current user as default
        setFormData(prev => ({ ...prev, user_id: user.id }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.product_id || !formData.warehouse_id) {
      setError("Please select both product and warehouse");
      setLoading(false);
      return;
    }

    if (formData.quantity <= 0) {
      setError("Quantity must be greater than 0");
      setLoading(false);
      return;
    }

    if (!formData.reason) {
      setError("Please provide a reason for this movement");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/inventory", formData);
      setSuccess("Inventory record added successfully!");
      setTimeout(() => navigate(`${basePath}/inventory/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to add inventory record");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !products.length) {
    return <LoadingSpinner />;
  }

   return (
    <div className="inventory-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Add Inventory Movement</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
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
                  {product.name} ({product.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Warehouse*</label>
            <select
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.location})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
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
              <option value="in">Inbound (+)</option>
              <option value="out">Outbound (-)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Reason*</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            required
            maxLength="500"
            placeholder="Enter the reason for this inventory movement..."
          />
        </div>

        <div className="form-group">
          <label>Recorded By*</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Adding..." : "Add Inventory Record"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/inventory/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventory;