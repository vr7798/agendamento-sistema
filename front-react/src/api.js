import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const login = async (username, password) => {
  try {
    console.log("Tentativa de login com:", { username, password });
    const response = await api.post("/login", { username, password });
    console.log("Resposta da API (login):", response.data);
    toast.success("Login realizado com sucesso!");
    return response;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Erro ao tentar login. Tente novamente.";
    console.error("Erro durante o login:", errorMessage);
    toast.error(errorMessage); // Exibe a mensagem de erro específica
    throw error;
  }
};

// Função de registro
export const register = async (userData) => {
  try {
    console.log("Enviando dados para a API (registro):", userData);
    const response = await api.post(
      "http://192.168.100.6:5000/api/auth/registrar",
      userData
    );
    console.log("Resposta da API (registro):", response.data);
    toast.success(response.data.message);
    return response;
  } catch (error) {
    console.error(
      "Erro ao registrar usuário:",
      error.response ? error.response.data : error.message
    );
    toast.error(
      error.response
        ? error.response.data.message
        : "Erro ao registrar usuário. Tente novamente."
    );
    throw error;
  }
};
