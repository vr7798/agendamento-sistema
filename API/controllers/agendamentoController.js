const Agendamento = require("../models/Agendamento");

// Controlador para criar um agendamento
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

// Controlador para listar todos os agendamentos
exports.listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar agendamentos", error });
  }
};

// Controlador para excluir um agendamento
exports.excluirAgendamento = async (req, res) => {
  const { id } = req.params;

  try {
    const agendamento = await Agendamento.findByIdAndDelete(id);
    if (!agendamento) {
      return res.status(404).send("Agendamento não encontrado");
    }

    res.status(200).send("Agendamento excluído com sucesso");
  } catch (err) {
    console.error("Erro ao excluir agendamento:", err);
    res.status(500).send("Erro no servidor");
  }
};

// Controlador para atualizar um agendamento
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

    res.status(200).json({
      message: "Agendamento atualizado com sucesso",
      agendamento,
    });
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    res.status(500).send("Erro no servidor");
  }
};
