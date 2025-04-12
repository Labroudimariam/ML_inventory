import React, { useState, useEffect } from "react";
import axios from "../../axios"; 
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role !== 'admin' && user?.role !== 'subadmin' && user?.role !== 'storekeeper') {
    setError("You don't have permission to view products");
    return;
  }

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.response || error.message);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        setError("Failed to delete product.");
      }
    }
  };

  return (
    <div className="product-list">
      <h2>Products</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category?.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <Link to={`/product/edit/${product.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/product/add" className="btn">Add New Product</Link>
    </div>
  );
};

export default ProductList;
