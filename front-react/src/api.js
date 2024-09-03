import axios from "axios";
import { toast } from "react-toastify";

// Criação de uma instância Axios com base na URL base definida em variáveis de ambiente
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Função de login
export const login = async (username, password) => {
  try {
    console.log("Tentativa de login com:", { username, password });
    const response = await api.post("/api/auth/login", { username, password });
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
    const response = await api.post("/api/auth/registrar", userData);
    console.log("Resposta da API (registro):", response.data);
    toast.success("Registro realizado com sucesso!");
    return response;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Erro ao registrar usuário. Tente novamente.";
    console.error("Erro ao registrar usuário:", errorMessage);
    toast.error(errorMessage); // Exibe a mensagem de erro específica
    throw error;
  }
};

// Função de criação de agendamento
export const criarAgendamento = async (agendamentoData) => {
  try {
    console.log(
      "Enviando dados para a API (criação de agendamento):",
      agendamentoData
    );
    const response = await api.post("/api/agendamentos", agendamentoData);
    console.log("Resposta da API (criação de agendamento):", response.data);
    toast.success("Agendamento criado com sucesso!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Erro ao criar agendamento. Tente novamente.";
    console.error("Erro ao criar agendamento:", errorMessage);
    toast.error(errorMessage); // Exibe a mensagem de erro específica
    throw error;
  }
};
