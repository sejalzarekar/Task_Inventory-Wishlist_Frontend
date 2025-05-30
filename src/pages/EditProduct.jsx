import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const EditProduct = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product details by id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch all products (because backend only has GET /products)
        const res = await fetch("http://localhost:5000/api/products", {
          headers: {
            Authorization: token ? token : "",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout();
            navigate("/login");
          }
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        const product = data.find((p) => p.id === Number(id));
        if (!product) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        setForm({
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
        });
      } catch (err) {
        setError(err.message || "Error loading product");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, logout, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.stock || !form.category) {
      setError("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? token : "",
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
          navigate("/login");
        }
        throw new Error("Failed to update product");
      }

      // On success redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error updating product");
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Product</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price ($):</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Stock:</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category:</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Update Product
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
