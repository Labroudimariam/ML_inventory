import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import NavbarTop from "../navbar/NavbarTop";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      user?.role !== "admin" &&
      user?.role !== "subadmin" &&
      user?.role !== "storekeeper"
    ) {
      setError("You don't have permission to view warehouses");
      return;
    }

    const fetchWarehouses = async () => {
      try {
        const response = await axios.get("/warehouses");
        setWarehouses(response.data);
      } catch (error) {
        console.error(
          "Error fetching warehouses:",
          error.response || error.message
        );
        setError("Failed to fetch warehouses.");
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      try {
        await axios.delete(`/warehouses/${id}`);
        setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
      } catch (error) {
        setError("Failed to delete warehouse.");
      }
    }
  };

  return (
    <div className="warehouse-list">
      <NavbarTop />
      <Navbar />
      <h2>Warehouses</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border={"1"}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr key={warehouse.id}>
                <td>{warehouse.name}</td>
                <td>{warehouse.location}</td>
                <td>{warehouse.description}</td>
                <td>
                  <Link to={`/warehouse/edit/${warehouse.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(warehouse.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/warehouse/add" className="btn">
        Add New Warehouse
      </Link>
    </div>
  );
};

export default WarehouseList;
