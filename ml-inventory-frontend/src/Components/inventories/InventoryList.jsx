import React, { useState, useEffect } from "react";
import axios from "../../axios"; 
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import NavbarTop from "../navbar/NavbarTop";

const InventoryList = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'admin' && user?.role !== 'subadmin' && user?.role !== 'storekeeper') {
      setError("You don't have permission to view inventory records");
      return;
    }

    const fetchInventories = async () => {
      try {
        const response = await axios.get("/inventory");
        setInventories(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error.response || error.message);
        setError("Failed to fetch inventory records.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInventories();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inventory record?")) {
      try {
        await axios.delete(`/inventory/${id}`);
        setInventories(inventories.filter((item) => item.id !== id));
      } catch (error) {
        setError("Failed to delete inventory record.");
      }
    }
  };

  return (
    <div className="inventory-list">
      <NavbarTop />
      <Navbar />
      <h2>Inventory Records</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border={"1"}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Movement Type</th>
              <th>Reason</th>
              <th>User</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((item) => (
              <tr key={item.id}>
                <td>{item.product?.name || 'N/A'}</td>
                <td>{item.quantity}</td>
                <td style={{ color: item.movement_type === 'in' ? 'green' : 'red' }}>
                  {item.movement_type.toUpperCase()}
                </td>
                <td>{item.reason}</td>
                <td>{item.user?.name || 'N/A'}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>
                  <Link to={`/inventory/edit/${item.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/inventory/add" className="btn">Add New Inventory Record</Link>
    </div>
  );
};

export default InventoryList;