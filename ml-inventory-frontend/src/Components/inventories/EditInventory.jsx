import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import NavbarTop from "../navbar/NavbarTop";
import Navbar from "../navbar/Navbar";

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [inventoryRes, productsRes, usersRes] = await Promise.all([
          axios.get(`/inventory/${id}`),
          axios.get("/products"),
          axios.get("/users")
        ]);

        setInventory(inventoryRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to fetch inventory data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (inventory.quantity <= 0) {
      setError("Quantity must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/inventory/${id}`, inventory);
      setSuccess("Inventory record updated successfully!");
      setTimeout(() => navigate("/inventory/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update inventory record");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !inventory.id) {
    return <div>Loading inventory data...</div>;
  }

  return (
    <div className="container mt-4">
      <NavbarTop />
      <Navbar />
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit Inventory Record</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Product*</label>
                <select
                  className="form-select"
                  name="product_id"
                  value={inventory.product_id}
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

              <div className="col-md-6">
                <label className="form-label">Quantity*</label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  min="1"
                  value={inventory.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Movement Type*</label>
                <select
                  className="form-select"
                  name="movement_type"
                  value={inventory.movement_type}
                  onChange={handleChange}
                  required
                >
                  <option value="in">In</option>
                  <option value="out">Out</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Reason*</label>
                <input
                  type="text"
                  className="form-control"
                  name="reason"
                  value={inventory.reason}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">User*</label>
                <select
                  className="form-select"
                  name="user_id"
                  value={inventory.user_id}
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

              <div className="col-12">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Inventory Record"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/inventory/list")}
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

export default EditInventory;