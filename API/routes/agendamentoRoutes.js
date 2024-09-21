const express = require("express");
const router = express.Router();
const agendamentoController = require("../controllers/agendamentoController");
const { proteger } = require("../middleware/authMiddleware");

// Rota para criar um agendamento
router.post("/", proteger, agendamentoController.criarAgendamento);

// Rota para listar todos os agendamentos
router.get("/", proteger, agendamentoController.listarAgendamentos);

// Rota para listar todos os agendamentos (sem proteção)
router.get('/todos',proteger, agendamentoController.listarTodosAgendamentos);

// Rota para listar agendamentos filtrados
router.get('/filtrados', proteger, agendamentoController.listarAgendamentosFiltrados);

// Rota para atualizar um agendamento
router.put("/:id", proteger, agendamentoController.atualizarAgendamento);

// Rota para atualizar a etapa de um agendamento
router.put("/:id/etapa", proteger, agendamentoController.atualizarEtapaAgendamento);

// Rota para excluir um agendamento
router.delete("/:id", proteger, agendamentoController.excluirAgendamento);

// **Nova Rota: Adicionar Ocorrência a um Agendamento**
router.post("/:id/ocorrencias", proteger, agendamentoController.adicionarOcorrencia);

module.exports = router;
