import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const login = async (username, password) => {
  return await api.post("/login", { username, password });
};

export const register = async (userData) => {
  try {
    console.log("Enviando dados para a API:", userData); // Log para verificar o que está sendo enviado
    const response = await axios.post(
      "http://localhost:5000/api/auth/registrar",
      userData
    );
    return response;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error); // Log para capturar erros no frontend
    throw error;
  }
};
