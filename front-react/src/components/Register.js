// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }
    try {
      await register(username, password);
      toast.success(
        "Usuário registrado com sucesso! Faça login para continuar."
      );
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error("Usuário já existe!");
      } else {
        toast.error("Erro ao registrar usuário. Tente novamente.");
      }
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
          autoComplete="new-password"
        />
      </div>
      <div>
        <label>Confirmar Senha: </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
