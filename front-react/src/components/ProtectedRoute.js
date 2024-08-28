import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decodificar o token JWT para verificar a função do usuário
  const userInfo = JSON.parse(atob(token.split(".")[1]));

  // Se a rota for somente para admin e o usuário não for admin, redireciona para o Dashboard
  if (adminOnly && userInfo.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  // Se passar todas as verificações, renderiza o componente filho
  return children;
};

export default ProtectedRoute;
