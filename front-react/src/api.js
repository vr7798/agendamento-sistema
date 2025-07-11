import axios from "axios";
import { toast } from "react-toastify";
const moment = require("moment-timezone");

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Token anexado no cabeçalho Authorization:",
        config.headers.Authorization
      );
    } else {
      console.log("Nenhum token encontrado no localStorage.");
    }
    console.log("Request Config:", config); // Log da configuração da requisição
    return config;
  },
  (error) => {
    console.error("Request Error:", error); // Log de erro de requisição
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros
api.interceptors.response.use(
  (response) => {
    // Retorna a resposta normalmente se for bem-sucedida
    return response;
  },
  (error) => {
    console.error("Response Error:", error); // Log de erro de resposta

    // Verifica se o erro é devido a token expirado ou inválido
    if (error.response && error.response.status === 404) {
      // Remove o token do localStorage
      localStorage.removeItem("token");
      console.log(
        "Token expirado ou inválido. Redirecionando para a página de login."
      );

      // Redireciona para a rota "/"
      window.location.href = "/";
    }

    // Rejeita a promessa com o erro
    return Promise.reject(error);
  }
);

// Função de login
export const login = async (username, password) => {
  try {
    console.log("Attempting login with:", { username, password }); // Log dos dados de login
    const response = await api.post("/api/auth/login", { username, password });
    toast.success("Login realizado com sucesso!");
    console.log("Login Response:", response); // Log da resposta do login
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data.message || "Erro ao tentar login. Tente novamente.";
    console.error("Login Error:", error); // Log de erro de login
    toast.error(errorMessage);
    throw error;
  }
};

// Função de registro
export const register = async (userData) => {
  try {
    console.log("Attempting registration with:", userData); // Log dos dados de registro
    const response = await api.post("/api/auth/registrar", userData);
    toast.success("Registro realizado com sucesso!");
    console.log("Registration Response:", response); // Log da resposta de registro
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data.message ||
      "Erro ao registrar usuário. Tente novamente.";
    console.error("Registration Error:", error); // Log de erro de registro
    toast.error(errorMessage);
    throw error;
  }
};

// Função de criação de agendamento
export const criarAgendamento = async (agendamentoData) => {
  try {
    console.log("Attempting to create agendamento with:", agendamentoData); // Log dos dados de criação de agendamento
    const response = await api.post("/api/agendamentos", agendamentoData);
    toast.success("Agendamento criado com sucesso!");
    console.log("Create Agendamento Response:", response); // Log da resposta de criação de agendamento
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data.message ||
      "Erro ao criar agendamento. Tente novamente.";
    console.error("Create Agendamento Error:", error); // Log de erro de criação de agendamento
    toast.error(errorMessage);
    throw error;
  }
};

// Função de atualização de agendamento
export const atualizarAgendamento = async (id, agendamentoData) => {
  try {
    console.log(
      "Attempting to update agendamento with ID:",
      id,
      "and data:",
      agendamentoData
    ); // Log dos dados de atualização de agendamento
    const response = await api.put(`/api/agendamentos/${id}`, agendamentoData);
    toast.success("Agendamento atualizado com sucesso!");
    console.log("Update Agendamento Response:", response); // Log da resposta de atualização de agendamento
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data.message ||
      "Erro ao atualizar agendamento. Tente novamente.";
    console.error("Update Agendamento Error:", error); // Log de erro de atualização de agendamento
    toast.error(errorMessage);
    throw error;
  }
};

// Função para atualizar o perfil
export const atualizarPerfil = async (userData) => {
  try {
    console.log("Attempting to update user profile with:", userData); // Log dos dados de atualização de perfil
    const response = await api.put("/api/users/me", userData);
    toast.success("Perfil atualizado com sucesso!");
    console.log("Update Profile Response:", response); // Log da resposta de atualização de perfil
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data.message ||
      "Erro ao atualizar perfil. Tente novamente.";
    console.error("Update Profile Error:", error); // Log de erro de atualização de perfil
    toast.error(errorMessage);
    throw error;
  }
};

// Função para buscar o perfil do usuário logado
export const getPerfil = async () => {
  try {
    console.log("Attempting to get user profile"); // Log da tentativa de obter perfil
    const response = await api.get("/api/users/me");
    console.log("Get Profile Response:", response); // Log da resposta de obtenção de perfil
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data.message || "Erro ao buscar perfil. Tente novamente.";
    console.error("Get Profile Error:", error); // Log de erro ao buscar perfil
    toast.error(errorMessage);
    throw error;
  }
};


// Função para buscar agendamentos filtrados
export const getAgendamentosFiltrados = async (
  dataInicio,
  dataFim,
  local,
  nome,
  etapa // Novo parâmetro
) => {
  try {
    const params = {};

    // Adiciona o intervalo de datas se ambos estiverem definidos
    if (dataInicio && dataFim) {
      params.dataInicio = moment(dataInicio).format("YYYY-MM-DD");
      params.dataFim = moment(dataFim).format("YYYY-MM-DD");
    }

    // Adiciona o local se estiver definido
    if (local) {
      params.local = local;
    }

    // Adiciona o nome se estiver definido
    if (nome) {
      params.nome = nome;
    }

    // Adiciona a etapa se estiver definida
    if (etapa) {
      params.etapa = etapa;
    }

    console.log("Attempting to get filtered agendamentos with params:", params); // Log dos parâmetros de filtro

    const response = await api.get("/api/agendamentos/filtrados", { params });
    console.log("Get Filtered Agendamentos Response:", response); // Log da resposta de obtenção de agendamentos filtrados
    return response.data;
  } catch (error) {
    console.error("Get Filtered Agendamentos Error:", error); // Log de erro ao buscar agendamentos filtrados
    toast.error("Erro ao buscar agendamentos filtrados.");
    throw error;
  }
};


// Função para buscar todos os agendamentos
export const getAgendamentosTodos = async () => {
  try {
    console.log("Attempting to get all agendamentos"); // Log da tentativa de obter todos os agendamentos
    const response = await api.get("/api/agendamentos/todos");
    console.log("Get All Agendamentos Response:", response); // Log da resposta de obtenção de todos os agendamentos
    return response.data;
  } catch (error) {
    console.error("Get All Agendamentos Error:", error); // Log de erro ao buscar todos os agendamentos
    toast.error("Erro ao buscar agendamentos.");
    throw error;
  }
};

// Função de atualização da etapa (front-end)
export const atualizarEtapaAgendamento = async (id, novaEtapa) => {
  try {
    console.log(
      "Attempting to update etapa of agendamento with ID:",
      id,
      "and new etapa:",
      novaEtapa
    );

    const response = await api.put(`/api/agendamentos/${id}/etapa`, {
      novaEtapa,
    });

    toast.success("Etapa do agendamento atualizada com sucesso!"); // Sucesso

    console.log("Update Etapa Response:", response);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data.message ||
      "Erro ao atualizar etapa do agendamento. Tente novamente.";

    toast.error(errorMessage); // Erro
    console.error("Update Etapa Error:", error);

    throw error;
  }
};

// Função de adicionar ocorrência
export const adicionarOcorrencia = async (id, mensagem) => {
  try {
    console.log(
      "Attempting to add ocorrência to agendamento with ID:",
      id,
      "and mensagem:",
      mensagem
    );
    const response = await api.post(`/api/agendamentos/${id}/ocorrencias`, {
      mensagem,
    });
    toast.success("Ocorrência adicionada com sucesso!");
    console.log("Adicionar Ocorrencia Response:", response); // Log da resposta de adição de ocorrência
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data.message ||
      "Erro ao adicionar ocorrência. Tente novamente.";
    console.error("Adicionar Ocorrencia Error:", error); // Log de erro ao adicionar ocorrência
    toast.error(errorMessage);
    throw error;
  }
};
