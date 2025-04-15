import React, { useState, useEffect } from "react";
import axios from "../../axios"; 
import { Link } from "react-router-dom";

const OrderItemList = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'admin' && user?.role !== 'subadmin' && user?.role !== 'storekeeper') {
      setError("You don't have permission to view order items");
      return;
    }

    const fetchOrderItems = async () => {
      try {
        const response = await axios.get("/order-items");
        setOrderItems(response.data);
      } catch (error) {
        console.error("Error fetching order items:", error.response || error.message);
        setError("Failed to fetch order items.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrderItems();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order item?")) {
      try {
        await axios.delete(`/order-items/${id}`);
        setOrderItems(orderItems.filter((item) => item.id !== id));
      } catch (error) {
        setError("Failed to delete order item.");
      }
    }
  };

  return (
    <div className="order-item-list">
      <h2>Order Items</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border={"1"}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.id}>
                <td>{item.order_id}</td>
                <td>{item.product?.name || 'N/A'}</td>
                <td>{item.quantity}</td>
                <td>{item.unit_price}</td>
                <td>{item.total_price}</td>
                <td>
                  <Link to={`/order-item/edit/${item.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/order-item/add" className="btn">Add New Order Item</Link>
    </div>
  );
};

export default OrderItemList;