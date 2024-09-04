const express = require("express");
const router = express.Router();
const agendamentoController = require("../controllers/agendamentoController");
const { proteger } = require("../middleware/authMiddleware");

// Rota para criar um agendamento
router.post("/", proteger, agendamentoController.criarAgendamento);

// Rota para listar todos os agendamentos
router.get("/", proteger, agendamentoController.listarAgendamentos);

// Rota para listar agendamentos de hoje
router.get("/hoje", proteger, agendamentoController.listarAgendamentosHoje);

// Rota para atualizar um agendamento
router.put("/:id", proteger, agendamentoController.atualizarAgendamento);

// Rota para excluir um agendamento
router.delete("/:id", proteger, agendamentoController.excluirAgendamento);

module.exports = router;
