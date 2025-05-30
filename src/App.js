import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./components/AuthContext";

import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct"; // import AddProduct component
import EditProduct from "./pages/EditProduct";

function PrivateRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  return !token ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public routes */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Add product route */}
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
  path="/edit-product/:id"
  element={
    <PrivateRoute>
      <EditProduct />
    </PrivateRoute>
  }
/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
