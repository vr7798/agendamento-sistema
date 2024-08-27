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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Usuário: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div>
        <label>Senha: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <button type="submit">Login</button>
      <p>
        Não tem uma conta? <Link to="/register">Registre-se aqui</Link>
      </p>
    </form>
  );
};

export default Login;
