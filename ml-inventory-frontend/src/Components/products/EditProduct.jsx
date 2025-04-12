import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialProduct, setInitialProduct] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
        setInitialProduct(response.data); 
      } catch (error) {
        setError("Failed to fetch product.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
  
    const formData = new FormData();
  
    // Ajouter uniquement les champs modifiés
    if (product.name !== initialProduct.name) formData.append('name', product.name);
    if (product.category_id !== initialProduct.category_id) formData.append('category_id', product.category_id);
    if (product.warehouse !== initialProduct.warehouse) formData.append('warehouse', product.warehouse);
    if (product.quantity !== initialProduct.quantity) formData.append('quantity', product.quantity);
    if (product.unit !== initialProduct.unit) formData.append('unit', product.unit);
    if (product.price !== initialProduct.price) formData.append('price', product.price);
    if (product.status !== initialProduct.status) formData.append('status', product.status);
  
    // Gestion spéciale pour l'image
    if (product.image && product.image !== initialProduct.image) {
      if (typeof product.image !== 'string') { 
        formData.append('image', product.image);
      }
    }
  
    try {
      await axios.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      navigate("/admin-dashboard");
    } catch (error) {
      // Gestion des erreurs
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Convertir les valeurs des champs numériques en nombre
    if (name === "category_id" || name === "quantity" || name === "price") {
      updatedValue = Number(value);
    }

    setProduct({ ...product, [name]: updatedValue });
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="edit-product">
      <h2>Edit Product</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleUpdateProduct}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Warehouse</label>
          <input
            type="text"
            name="warehouse"
            value={product.warehouse}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Unit</label>
          <input
            type="text"
            name="unit"
            value={product.unit}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={product.status} onChange={handleChange}>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="low-stock">Low Stock</option>
          </select>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              name="image"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setProduct({ ...product, image: e.target.files[0] });
                }
              }}
            />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
