// src/components/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null); // Estado para armazenar a função do usuário
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userInfo = JSON.parse(atob(token.split(".")[1]));
      setRole(userInfo.role);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      const { token } = response.data;

      // Decodificar o token JWT para obter as informações do usuário (como role)
      const userInfo = JSON.parse(atob(token.split(".")[1]));

      setToken(token);
      localStorage.setItem("token", token);
      setRole(userInfo.role);

      toast.success("Login realizado com sucesso!");

      // Redirecionar para o Dashboard se o usuário for admin, ou para uma página padrão
      if (userInfo.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/secreta"); // Para o usuário comum, redirecione para uma página padrão
      }
    } catch (err) {
      toast.error("Credenciais inválidas!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Usuário:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors">
            Login
          </button>
        </form>
        {role === "admin" && (
          <div className="mt-6 text-center">
            <Link to="/dashboard" className="text-blue-500 hover:underline">
              Acessar Dashboard
            </Link>
          </div>
        )}
        <p className="mt-6 text-center">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Registre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
