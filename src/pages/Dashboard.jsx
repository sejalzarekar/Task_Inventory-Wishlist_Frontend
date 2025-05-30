import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "../style/Dashboard.css"; 

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: token || "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Error fetching products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts(); // Refresh list
    } catch (err) {
      alert(err.message || "Error deleting product");
    }
  };

  return (
    <div className="dashboard container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">📊 Dashboard</h2>
        <div>
          <button className="btn btn-outline-success me-2" onClick={() => navigate("/add-product")}>
            ➕ Add Product
          </button>
          <button className="btn btn-outline-danger" onClick={logout}>
            🔒 Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">No products found.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded bg-white">
          <table className="table table-hover table-bordered align-middle mb-0">
            <thead className="table-primary text-center">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price ($)</th>
                <th>Stock</th>
                <th style={{ width: '80px' }}>Edit</th>
                <th style={{ width: '80px' }}>Delete</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {products.map(({ id, name, category, price, stock }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{category}</td>
                  <td>${price}</td>
                  <td>{stock}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => navigate(`/edit-product/${id}`)}
                    >
                      ✏️
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
