// src/components/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      setToken(response.data.token);
      toast.success("Login realizado com sucesso!");
      navigate("/secreta");
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
