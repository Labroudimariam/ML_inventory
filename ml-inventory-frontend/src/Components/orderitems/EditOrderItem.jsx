import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

const EditOrderItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderItem, setOrderItem] = useState({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderItemRes, ordersRes, productsRes] = await Promise.all([
          axios.get(`/order-items/${id}`),
          axios.get("/orders"),
          axios.get("/products")
        ]);

        setOrderItem(orderItemRes.data);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError("Failed to fetch order item data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  useEffect(() => {
    if (orderItem.product_id && orderItem.quantity) {
      const product = products.find(p => p.id == orderItem.product_id);
      if (product) {
        const total = product.price * orderItem.quantity;
        setOrderItem(prev => ({
          ...prev,
          unit_price: product.price,
          total_price: total
        }));
      }
    }
  }, [orderItem.product_id, orderItem.quantity, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (orderItem.quantity <= 0) {
      setError("Quantity must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/order-items/${id}`, orderItem);
      setSuccess("Order item updated successfully!");
      setTimeout(() => navigate("/order-items/list"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order item");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orderItem.id) {
    return <div>Loading order item data...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Edit Order Item</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Order*</label>
                <select
                  className="form-select"
                  name="order_id"
                  value={orderItem.order_id}
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

              <div className="col-md-6">
                <label className="form-label">Product*</label>
                <select
                  className="form-select"
                  name="product_id"
                  value={orderItem.product_id}
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

              <div className="col-md-6">
                <label className="form-label">Quantity*</label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  min="1"
                  value={orderItem.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Unit Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="unit_price"
                  value={orderItem.unit_price}
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Total Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="total_price"
                  value={orderItem.total_price}
                  readOnly
                />
              </div>

              <div className="col-12">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Order Item"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/order-items/list")}
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

export default EditOrderItem;