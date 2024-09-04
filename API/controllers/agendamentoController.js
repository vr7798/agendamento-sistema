const Agendamento = require("../models/Agendamento");

// Criar um agendamento
exports.criarAgendamento = async (req, res) => {
  try {
    const { nome, sobrenome, numero, horario, dia, local, observacao } =
      req.body;

    if (!nome || !sobrenome || !numero || !horario || !dia || !local) {
      return res.status(400).json({
        message: "Todos os campos obrigatórios devem ser preenchidos",
      });
    }

    const novoAgendamento = new Agendamento({
      nome,
      sobrenome,
      numero,
      horario,
      dia,
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
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Reseta as horas para o início do dia

    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1); // Define o limite para o fim do dia (amanhã)

    const agendamentosHoje = await Agendamento.find({
      dia: {
        $gte: hoje, // Maior ou igual a hoje
        $lt: amanha, // Menor que amanhã
      },
    });

    res.status(200).json(agendamentosHoje);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar agendamentos de hoje", error });
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
