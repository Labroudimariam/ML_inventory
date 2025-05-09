import React, { useState, useEffect } from "react";
import axios from "../../axios"; 
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import NavbarTop from "../navbar/NavbarTop";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'admin' && user?.role !== 'subadmin') {
      setError("You don't have permission to view categories");
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.response || error.message);
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`/categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
      } catch (error) {
        setError("Failed to delete category. Make sure no products are associated with it.");
      }
    }
  };

  return (
    <div className="category-list">
           <NavbarTop />
            <Navbar />
      <h2>Categories</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border={"1"}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description || '-'}</td>
                <td>
                  <Link to={`/category/edit/${category.id}`}>Edit</Link> |{" "}
                  <button onClick={() => handleDelete(category.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/category/add" className="btn">Add New Category</Link>
    </div>
  );
};

export default CategoryList;