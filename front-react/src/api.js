import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
// Criação de uma instância Axios com base na URL base definida em variáveis de ambiente
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Adicionar um interceptor para injetar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Pega o token do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// Função de atualização de agendamento
export const atualizarAgendamento = async (id, agendamentoData) => {
  try {
    console.log(
      "Enviando dados para a API (atualização de agendamento):",
      agendamentoData
    );
    const response = await api.put(`/api/agendamentos/${id}`, agendamentoData);
    console.log("Resposta da API (atualização de agendamento):", response.data);
    toast.success("Agendamento atualizado com sucesso!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Erro ao atualizar agendamento. Tente novamente.";
    console.error("Erro ao atualizar agendamento:", errorMessage);
    toast.error(errorMessage); // Exibe a mensagem de erro específica
    throw error;
  }
};

export const atualizarPerfil = async (userData) => {
  try {
    const response = await api.put("/api/users/me", userData); // Certifique-se de que a rota é "/me"
    toast.success("Perfil atualizado com sucesso!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Erro ao atualizar perfil. Tente novamente.";
    toast.error(errorMessage);
    throw error;
  }
};

// Função para buscar o perfil do usuário logado
export const getPerfil = async () => {
  try {
    console.log("Buscando dados do perfil do usuário");
    const response = await api.get("/api/users/me"); // Endpoint que busca o perfil do usuário
    console.log("Dados do perfil recebidos:", response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Erro ao buscar perfil. Tente novamente.";
    console.error("Erro ao buscar perfil:", errorMessage);
    toast.error(errorMessage); // Exibe a mensagem de erro específica
    throw error;
  }
};

export const getAgendamentosHoje = async () => {
  try {
    const response = await api.get("/api/agendamentos/hoje");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos de hoje:", error);
    toast.error("Erro ao buscar agendamentos.");
    throw error;
  }
};

// Função para buscar agendamentos gerais com filtros de data e clínica
export const getAgendamentosGerais = async (data, clinica) => {
  try {
    const params = {};

    // Formata a data corretamente antes de enviar, caso exista
    if (data) {
      const dataFormatada = moment(data).format("YYYY-MM-DD"); // Formata a data para garantir que está no formato correto
      params.data = dataFormatada;
    }

    // Adiciona a clínica aos parâmetros de consulta, se fornecida
    if (clinica) {
      params.clinica = clinica;
    }

    // Realiza a requisição GET com os parâmetros de consulta
    const response = await api.get("/api/agendamentos", { params });

    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Erro ao buscar agendamentos gerais. Tente novamente.";
    toast.error(errorMessage);
    throw error;
  }
};
