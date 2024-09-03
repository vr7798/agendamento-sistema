const express = require("express");
const router = express.Router();
const agendamentoController = require("../controllers/agendamentoController");

// Rota para criar um agendamento
router.post("/", agendamentoController.criarAgendamento);

// Rota para listar todos os agendamentos (esta rota deve existir para a requisição GET funcionar)
router.get("/", agendamentoController.listarAgendamentos);
// Rota para excluir um agendamento
router.delete("/:id", agendamentoController.excluirAgendamento);

module.exports = router;
