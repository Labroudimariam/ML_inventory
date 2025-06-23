import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./orderForm.css";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    beneficiary_id: "",
    user_id: "",
    order_number: "",
    type: "Semen",
    status: "Pending",
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: "",
    notes: "",
    products: []
  });
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
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
        const [orderRes, beneficiariesRes, usersRes, productsRes] = await Promise.all([
          axios.get(`/orders/${id}`),
          axios.get("/beneficiaries"),
          axios.get("/users"),
          axios.get("/products")
        ]);

        const formattedOrder = {
          ...orderRes.data,
          order_date: orderRes.data.order_date.split('T')[0],
          expected_delivery_date: orderRes.data.expected_delivery_date ?
            orderRes.data.expected_delivery_date.split('T')[0] : "",
          products: orderRes.data.products.map(p => ({
            product_id: p.id,
            quantity: p.pivot.quantity,
            unit_price: p.pivot.unit_price,
            name: p.name
          }))
        };

        setOrder(formattedOrder);
        setBeneficiaries(beneficiariesRes.data);
        setUsers(usersRes.data);
        setAvailableProducts(productsRes.data);
      } catch (err) {
        setError("Failed to fetch order data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...order.products];
    updatedProducts[index][field] = field === 'quantity' || field === 'unit_price' 
      ? parseFloat(value) 
      : value;
    
    // If product_id changed, update the product details
    if (field === 'product_id') {
      const product = availableProducts.find(p => p.id == value);
      if (product) {
        updatedProducts[index].unit_price = product.price;
        updatedProducts[index].name = product.name;
      }
    }

    setOrder(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const addProduct = () => {
    setOrder(prev => ({
      ...prev,
      products: [
        ...prev.products,
        { product_id: "", quantity: 1, unit_price: 0, name: "" }
      ]
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = [...order.products];
    updatedProducts.splice(index, 1);
    setOrder(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const calculateTotal = () => {
    return order.products.reduce((total, product) => {
      return total + (product.quantity * product.unit_price);
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return order.products.reduce((total, product) => {
      return total + product.quantity;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!order.beneficiary_id || !order.order_number || !order.user_id) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (order.products.length === 0) {
      setError("Please add at least one product to the order");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...order,
        products: order.products.map(p => ({
          product_id: p.product_id,
          quantity: p.quantity,
          unit_price: p.unit_price
        })),
        total_amount: calculateTotal(),
        total_quantity: calculateTotalQuantity()
      };
      
      await axios.put(`/orders/${id}`, payload);
      setSuccess("Order updated successfully!");
      setTimeout(() => navigate(`${basePath}/orders/list`), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to update order");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order.id) {
    return <LoadingSpinner />;
  }

  return (
    <div className="order-form-container">
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <h2>Edit Order #{order.order_number}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Order Number*</label>
            <input
              type="text"
              name="order_number"
              value={order.order_number}
              onChange={handleChange}
              required
              maxLength="20"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Beneficiary*</label>
            <select
              name="beneficiary_id"
              value={order.beneficiary_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Beneficiary</option>
              {beneficiaries.map(beneficiary => (
                <option key={beneficiary.id} value={beneficiary.id}>
                  {beneficiary.name} ({beneficiary.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Created By*</label>
            <select
              name="user_id"
              value={order.user_id}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Order Type*</label>
            <select
              name="type"
              value={order.type}
              onChange={handleChange}
              required
            >
              <option value="Semen">Semen</option>
              <option value="Liquid nitrogen">Liquid Nitrogen</option>
              <option value="Insemination equipment">Insemination Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status*</label>
            <select
              name="status"
              value={order.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Order Date*</label>
            <input
              type="date"
              name="order_date"
              value={order.order_date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expected Delivery Date</label>
            <input
              type="date"
              name="expected_delivery_date"
              value={order.expected_delivery_date}
              onChange={handleChange}
              min={order.order_date}
            />
          </div>
        </div>

        <div className="products-section">
          <h3>Products</h3>
          <button type="button" onClick={addProduct} className="btn btn-sm btn-primary">
            Add Product
          </button>

          {order.products.map((product, index) => (
            <div key={index} className="product-row">
              <select
                value={product.product_id}
                onChange={(e) => handleProductChange(index, 'product_id', e.target.value)}
                required
              >
                <option value="">Select Product</option>
                {availableProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.quantity})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                required
              />

              <input
                type="number"
                min="0"
                step="0.01"
                value={product.unit_price}
                onChange={(e) => handleProductChange(index, 'unit_price', e.target.value)}
                required
              />

              <span>${(product.quantity * product.unit_price)}</span>

              <button 
                type="button" 
                onClick={() => removeProduct(index)}
                className="btn btn-sm btn-danger"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="totals-row">
            <strong>Total Quantity: {calculateTotalQuantity()}</strong>
            <strong>Total Amount: ${calculateTotal()}</strong>
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={order.notes}
            onChange={handleChange}
            rows="3"
            maxLength="500"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Updating..." : "Update Order"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/orders/list`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrder;