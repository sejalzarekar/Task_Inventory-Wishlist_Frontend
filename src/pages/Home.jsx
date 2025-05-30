import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="container mt-4">
    <h1>Welcome to Inventory Management</h1>
    <Link to="/login" className="btn btn-primary me-2">
      Login
    </Link>
    <Link to="/register" className="btn btn-secondary">
      Register
    </Link>
  </div>
);

export default Home;
