import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

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
  const [basePath, setBasePath] = useState("");

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

    if (!orderItem.order_id || !orderItem.product_id) {
      setError("Please select both order and product");
      setLoading(false);
      return;
    }

    if (orderItem.quantity <= 0) {
      setError("Quantity must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`/order-items/${id}`, orderItem);
      setSuccess("Order item updated successfully!");
      setTimeout(() => navigate(`${basePath}/order-items/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to update order item");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading && !orderItem.id) {
    return <LoadingSpinner />;
  }

  return (
    <div className="order-item-form-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Edit Order Item</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Order*</label>
            <select
              name="order_id"
              value={orderItem.order_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Order</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  Order #{order.order_number} - {order.beneficiary?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Product*</label>
            <select
              name="product_id"
              value={orderItem.product_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.unit}) - {formatCurrency(product.price)}
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
              value={orderItem.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Unit Price</label>
            <input
              type="text"
              name="unit_price"
              value={formatCurrency(orderItem.unit_price)}
              readOnly
            />
          </div>
        </div>

        <div className="form-group">
          <label>Total Price</label>
          <input
            type="text"
            name="total_price"
            value={formatCurrency(orderItem.total_price)}
            readOnly
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Updating..." : "Update Order Item"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/order-items/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderItem;