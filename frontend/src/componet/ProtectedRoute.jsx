// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const user = localStorage.getItem("user");

//   // If no user found in localStorage → redirect to /login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Otherwise show the protected page
//   return children;
// }
// src/componet/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * @param {ReactNode} children - Component to render if access allowed
 * @param {string} role - Optional role required (e.g., "Admin")
 */
export default function ProtectedRoute({ children, role }) {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return <Navigate to="/login" replace />;

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch (_) {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
  if (!user || typeof user !== "object") {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // User doesn't have required role
    alert("❌ Access denied: Admins only");
    return <Navigate to="/home" replace />;
  }

  return children;
}
