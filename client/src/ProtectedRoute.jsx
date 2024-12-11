import React from "react";
import { Navigate } from "react-router-dom";

// Define ProtectedRoute component
const ProtectedRoute = ({ component: Component, ...rest }) => {
  // Check authentication status (e.g., token existence)
  const isAuthenticated = !!localStorage.getItem("authToken") && !!localStorage.getItem("userId");

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
