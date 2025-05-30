import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "../style/AddProduct.css"; // Optional for extra styling

const AddProduct = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.stock || !form.category) {
      setError("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          navigate("/dashboard");
        }
        throw new Error("Failed to add product");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error adding product");
    }
  };

  return (
    <div className="container mt-5 add-product-form shadow-sm rounded p-4 bg-white">
      <h2 className="mb-4 text-primary fw-bold text-center">➕ Add New Product</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter product name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Price ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="price"
              placeholder="Enter price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Stock</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              placeholder="Enter stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              placeholder="Enter category"
              value={form.category}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-success me-3 px-4">
            ✅ Add Product
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate("/dashboard")}
          >
            ⬅️ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
