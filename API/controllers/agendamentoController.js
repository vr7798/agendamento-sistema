const Agendamento = require("../models/Agendamento");
const moment = require("moment-timezone");

// Criar um novo agendamento
exports.criarAgendamento = async (req, res) => {
  try {
    const { nome, sobrenome, numero, horario, dia, local, observacao } = req.body;

    if (!nome || !sobrenome || !numero || !horario || !dia || !local) {
      return res.status(400).json({
        message: "Todos os campos obrigatórios devem ser preenchidos",
      });
    }

    // Ajustar a data para o fuso horário correto
    const dataAgendamento = moment
      .tz(dia, "America/Sao_Paulo")
      .startOf("day")
      .toDate();

    const novoAgendamento = new Agendamento({
      nome,
      sobrenome,
      numero,
      horario,
      dia: dataAgendamento, // Salva a data ajustada
      local,
      observacao,
    });

    const agendamentoSalvo = await novoAgendamento.save();
    res.status(201).json({
      message: "Agendamento criado com sucesso",
      agendamento: agendamentoSalvo,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar agendamento", error });
  }
};

// Atualizar um agendamento existente
exports.atualizarAgendamento = async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome, numero, horario, dia, local, observacao } = req.body;

  try {
    const agendamento = await Agendamento.findByIdAndUpdate(
      id,
      { nome, sobrenome, numero, horario, dia, local, observacao },
      { new: true }
    );

    if (!agendamento) {
      return res.status(404).send("Agendamento não encontrado");
    }

    res.status(200).json({ message: "Agendamento atualizado com sucesso", agendamento });
  } catch (err) {
    res.status(500).send("Erro no servidor");
  }
};

// Listar agendamentos filtrados
exports.listarAgendamentosFiltrados = async (req, res) => {
  try {
    const { dataInicio, dataFim, local } = req.query;
    const filtro = {};

    console.log("Filtros recebidos:", { dataInicio, dataFim, local });

    // Ajustar o fuso horário para o horário local (UTC-3, Brasil)
    const timezone = "America/Sao_Paulo";

    // Filtrar por intervalo de datas (dataInicio e dataFim)
    if (dataInicio && dataFim) {
      const inicio = moment.tz(dataInicio, "YYYY-MM-DD", timezone).startOf("day").toDate();
      const fim = moment.tz(dataFim, "YYYY-MM-DD", timezone).endOf("day").toDate();
      filtro.dia = { $gte: inicio, $lte: fim };
    }

    // Filtrar por local, se fornecido
    if (local) {
      filtro.local = local;
    }

    console.log("Objeto de filtro aplicado:", filtro);

    // Buscar agendamentos com base nos filtros aplicados
    const agendamentos = await Agendamento.find(filtro);
    console.log("Agendamentos encontrados:", agendamentos);

    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar agendamentos filtrados", error });
  }
};

// Excluir um agendamento
exports.excluirAgendamento = async (req, res) => {
  const { id } = req.params;

  try {
    const agendamento = await Agendamento.findByIdAndDelete(id);
    if (!agendamento) {
      return res.status(404).send("Agendamento não encontrado");
    }

    res.status(200).send("Agendamento excluído com sucesso");
  } catch (err) {
    res.status(500).send("Erro no servidor");
  }
};


// Listar todos os agendamentos
exports.listarTodosAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar todos os agendamentos", error });
  }
};
// Listar todos os agendamentos
exports.listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar agendamentos", error });
  }
};