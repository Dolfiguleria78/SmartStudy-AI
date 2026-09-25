import React from "react";
import { Navigate } from "react-router-dom";

const decodeTokenRole = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const decoded = JSON.parse(json);
    return decoded?.role ?? null;
  } catch {
    return null;
  }
};

const RoleRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const role = storedRole || decodeTokenRole(token);

  if (!token) {
    return <Navigate to="/welcome" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;

