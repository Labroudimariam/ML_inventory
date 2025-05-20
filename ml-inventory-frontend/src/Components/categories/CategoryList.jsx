import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { FaRegTrashAlt, FaRegEdit, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "../loading/Loading";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import "./categoryList.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [basePath, setBasePath] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(4);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
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
      default:
        setBasePath('');
    }

    if (!["admin", "subadmin"].includes(user?.role)) {
      setError("You don't have permission to view categories");
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
        setSuccess("Categories loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories();
  }, []);

  // Get current categories
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`/categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
        setSuccess("Category deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete category. Make sure no products are associated with it.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="category-list-container">
      {/* Success and Error Alerts */}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="category-list-header">
        <h2>Categories</h2>
        <div className="header-controls">
          <Link to={`${basePath}/categories/add`} className="btn btn-primary add-category-btn">
            <FaPlus /> Add Category
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="category-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.length > 0 ? (
              currentCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${basePath}/categories/edit/${category.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaRegEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {categories.length > categoriesPerPage && (
        <nav className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
            </li>
            
            {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === Math.ceil(categories.length / categoriesPerPage) ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(categories.length / categoriesPerPage)}
              >
                <FaChevronRight />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default CategoryList;