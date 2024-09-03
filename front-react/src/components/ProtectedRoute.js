import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Certifique-se de importar corretamente o jwt-decode

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    // Decodificar o token JWT para verificar a função do usuário
    const userInfo = jwtDecode(token);

    // Se a rota for somente para admin e o usuário não for admin, redireciona para o Dashboard
    if (adminOnly && userInfo.role !== "admin") {
      return <Navigate to="/dashboard" />;
    }

    // Se passar todas as verificações, renderiza o componente filho
    return children;
  } catch (error) {
    // Caso o token seja inválido ou não decodificável, redireciona para login
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
