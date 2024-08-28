// src/components/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }
    try {
      await register({ username, password, role });
      toast.success(
        "Usuário registrado com sucesso! Faça login para continuar."
      );
      navigate("/login");
    } catch (err) {
      // A mensagem de erro é exibida pelo toast.error no `register` do `api.js`
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar</h2>
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
          <div className="mb-4">
            <label className="block text-gray-700">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              autoComplete="new-password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirmar Senha:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              autoComplete="new-password"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Função:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md">
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors">
            Registrar
          </button>
        </form>
        <p className="mt-6 text-center">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
