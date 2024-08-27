// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decodificar o token JWT para verificar a função do usuário
  const userInfo = JSON.parse(atob(token.split(".")[1]));
  if (userInfo.role !== "admin") {
    return <Navigate to="/secreta" />;
  }

  return children;
};

export default ProtectedRoute;
