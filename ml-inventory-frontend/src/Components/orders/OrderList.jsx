import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'admin' && user?.role !== 'subadmin' && user?.role !== 'storekeeper') {
      setError("You don't have permission to view orders");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error.response || error.message);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`/orders/${id}`);
        setOrders(orders.filter((order) => order.id !== id));
      } catch (error) {
        setError("Failed to delete order.");
      }
    }
  };

  return (
    <div className="order-list">
      <h2>Orders</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border={"1"}>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Beneficiary</th>
              <th>Created By</th>
              <th>Type</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Expected Delivery</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.beneficiary?.name}</td>
                <td>{order.user?.name}</td>
                <td>{order.type}</td>
                <td>{order.status}</td>
                <td>{order.order_date}</td>
                <td>{order.expected_delivery_date || 'N/A'}</td>
                <td>{order.total_amount}</td>
                <td>
                  <Link to={`/order/edit/${order.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/order/add" className="btn">Add New Order</Link>
    </div>
  );
};

export default OrderList;