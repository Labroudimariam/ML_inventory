import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const AddOrderItem = () => {
  const [formData, setFormData] = useState({
    order_id: "",
    product_id: "",
    quantity: 1,
    unit_price: 0,
    total_price: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get("/orders"),
          axios.get("/products")
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError("Failed to fetch orders or products");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.product_id && formData.quantity) {
      const product = products.find(p => p.id == formData.product_id);
      if (product) {
        const total = product.price * formData.quantity;
        setFormData(prev => ({
          ...prev,
          unit_price: product.price,
          total_price: total
        }));
      }
    }
  }, [formData.product_id, formData.quantity, products]);

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
      const res = await axios.post("/order-items", formData);
      setSuccess("Order item added successfully!");
      setTimeout(() => navigate("/order-items/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add order item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-order-item">
      <h2>Add Order Item</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order*</label>
          <select
            name="order_id"
            value={formData.order_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Order</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                Order #{order.id}
              </option>
            ))}
          </select>
        </div>

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
                {product.name} (${product.price})
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
          <label>Unit Price</label>
          <input
            type="number"
            name="unit_price"
            value={formData.unit_price}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Total Price</label>
          <input
            type="number"
            name="total_price"
            value={formData.total_price}
            readOnly
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Order Item"}
        </button>
      </form>
    </div>
  );
};

export default AddOrderItem;