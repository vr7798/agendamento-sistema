const Agendamento = require("../models/Agendamento");
const moment = require("moment-timezone");

exports.criarAgendamento = async (req, res) => {
  try {
    const { nome, sobrenome, numero, horario, dia, local, observacao } =
      req.body;

    if (!nome || !sobrenome || !numero || !horario || !dia || !local) {
      return res.status(400).json({
        message: "Todos os campos obrigatórios devem ser preenchidos",
      });
    }

    // Usando Moment.js para ajustar a data para o fuso horário correto
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

// Listar todos os agendamentos
exports.listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar agendamentos", error });
  }
};

exports.listarAgendamentosHoje = async (req, res) => {
  try {
    const hoje = moment.tz("America/Sao_Paulo").startOf("day"); // Definindo o início do dia no fuso horário correto
    const amanha = moment(hoje).add(1, "days");

    const agendamentosHoje = await Agendamento.find({
      dia: {
        $gte: hoje.toDate(),
        $lt: amanha.toDate(),
      },
    });

    res.status(200).json(agendamentosHoje);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar agendamentos", error });
  }
};
// Atualizar um agendamento
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

    res
      .status(200)
      .json({ message: "Agendamento atualizado com sucesso", agendamento });
  } catch (err) {
    res.status(500).send("Erro no servidor");
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
