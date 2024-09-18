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
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Função de login
export const login = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login", { username, password });
    toast.success("Login realizado com sucesso!");
    return response;
  } catch (error) {
    const errorMessage = error.response?.data.message || "Erro ao tentar login. Tente novamente.";
    toast.error(errorMessage);
    throw error;
  }
};

// Função de registro
export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/registrar", userData);
    toast.success("Registro realizado com sucesso!");
    return response;
  } catch (error) {
    const errorMessage = error.response?.data.message || "Erro ao registrar usuário. Tente novamente.";
    toast.error(errorMessage);
    throw error;
  }
};

// Função de criação de agendamento
export const criarAgendamento = async (agendamentoData) => {
  try {
    const response = await api.post("/api/agendamentos", agendamentoData);
    toast.success("Agendamento criado com sucesso!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data.message || "Erro ao criar agendamento. Tente novamente.";
    toast.error(errorMessage);
    throw error;
  }
};

// Função de atualização de agendamento
export const atualizarAgendamento = async (id, agendamentoData) => {
  try {
    const response = await api.put(`/api/agendamentos/${id}`, agendamentoData);
    toast.success("Agendamento atualizado com sucesso!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data.message || "Erro ao atualizar agendamento. Tente novamente.";
    toast.error(errorMessage);
    throw error;
  }
};

export const atualizarPerfil = async (userData) => {
  try {
    const response = await api.put("/api/users/me", userData);
    toast.success("Perfil atualizado com sucesso!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data.message || "Erro ao atualizar perfil. Tente novamente.";
    toast.error(errorMessage);
    throw error;
  }
};

// Função para buscar o perfil do usuário logado
export const getPerfil = async () => {
  try {
    const response = await api.get("/api/users/me");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data.message || "Erro ao buscar perfil. Tente novamente.";
    toast.error(errorMessage);
    throw error;
  }
};

// Função para buscar todos os agendamentos
export const getAgendamentosTodos = async () => {
  try {
    const response = await api.get("/api/agendamentos/todos");
    return response.data;
  } catch (error) {
    toast.error("Erro ao buscar agendamentos.");
    throw error;
  }
};

export const getAgendamentosFiltrados = async (dataInicio, dataFim, local) => {
  try {
    const params = {};

    if (dataInicio && dataFim) {
      params.dataInicio = moment(dataInicio).format("YYYY-MM-DD");
      params.dataFim = moment(dataFim).format("YYYY-MM-DD");
    }

    if (local) {
      params.local = local;
    }

    const response = await api.get("/api/agendamentos/filtrados", { params });
    return response.data;
  } catch (error) {
    toast.error("Erro ao buscar agendamentos filtrados.");
    throw error;
  }
};

// Função para buscar a lista de médicos
export const getMedicos = async () => {
  try {
    const response = await api.get("/api/agendamentos/medicos");
    return response.data;
  } catch (error) {
    toast.error("Erro ao buscar lista de médicos");
    throw error;
  }
};
