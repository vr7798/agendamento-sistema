const Agendamento = require("../models/Agendamento");
const moment = require("moment-timezone");

// Criar um novo agendamento
exports.criarAgendamento = async (req, res) => {
  try {
    const { nome, sobrenome, numero, horario, dia, local, observacao } = req.body;

    console.log("Dados recebidos para criar agendamento:", { nome, sobrenome, numero, horario, dia, local, observacao });

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!nome || !sobrenome || !numero || !horario || !dia || !local) {
      console.log("Campos obrigatórios não preenchidos");
      return res.status(400).json({
        message: "Todos os campos obrigatórios devem ser preenchidos",
      });
    }

    // Ajustar a data para o fuso horário correto
    const dataAgendamento = moment
      .tz(dia, "America/Sao_Paulo")
      .startOf("day")
      .toDate();
    
    console.log("Data ajustada para agendamento:", dataAgendamento);

    const novoAgendamento = new Agendamento({
      nome,
      sobrenome,
      numero,
      horario,
      dia: dataAgendamento,
      local,
      observacao,
    });

    const agendamentoSalvo = await novoAgendamento.save();
    console.log("Agendamento criado com sucesso:", agendamentoSalvo);
    res.status(201).json({
      message: "Agendamento criado com sucesso",
      agendamento: agendamentoSalvo,
    });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ message: "Erro ao criar agendamento", error });
  }
};

// Atualizar um agendamento existente
exports.atualizarAgendamento = async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome, numero, horario, dia, local, observacao } = req.body;

  console.log("Dados recebidos para atualizar agendamento:", { id, nome, sobrenome, numero, horario, dia, local, observacao });

  try {
    const agendamento = await Agendamento.findByIdAndUpdate(
      id,
      { nome, sobrenome, numero, horario, dia, local, observacao },
      { new: true }
    );

    if (!agendamento) {
      console.log("Agendamento não encontrado:", id);
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    console.log("Agendamento atualizado com sucesso:", agendamento);
    res.status(200).json({ message: "Agendamento atualizado com sucesso", agendamento });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({ message: "Erro ao atualizar agendamento", error });
  }
};
// Listar agendamentos filtrados
exports.listarAgendamentosFiltrados = async (req, res) => {
  try {
    const { dataInicio, dataFim, local, nome, etapa } = req.query;
    const filtro = {};

    console.log("Filtros recebidos:", { dataInicio, dataFim, local, nome, etapa });

    // Ajustar o fuso horário para o horário local (UTC-3, Brasil)
    const timezone = "America/Sao_Paulo";

    // Filtrar por intervalo de datas
    if (dataInicio && dataFim) {
      const inicio = moment
        .tz(dataInicio, "YYYY-MM-DD", timezone)
        .startOf("day")
        .toDate();
      const fim = moment
        .tz(dataFim, "YYYY-MM-DD", timezone)
        .endOf("day")
        .toDate();
      filtro.dia = { $gte: inicio, $lte: fim };
    }

    // Filtrar por local, se fornecido
    if (local) {
      filtro.local = local;
    }

    // Filtrar por nome, se fornecido
    if (nome) {
      // Adicionar espaços extras para melhorar a correspondência
      const regex = new RegExp(
        nome
          .trim()
          .replace(/\s+/g, " ")
          .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
        "i"
      );
      filtro.nome = { $regex: regex };
    }

    // Filtrar por etapa, se fornecido
    if (etapa) {
      filtro.etapa = etapa;
    }

    console.log("Objeto de filtro aplicado:", filtro);

    const agendamentos = await Agendamento.find(filtro);
    console.log("Agendamentos encontrados:", agendamentos);

    res.status(200).json(agendamentos);
  } catch (error) {
    console.error("Erro ao listar agendamentos filtrados:", error);
    res.status(500).json({ message: "Erro ao listar agendamentos filtrados", error });
  }
};




// Excluir um agendamento
exports.excluirAgendamento = async (req, res) => {
  const { id } = req.params;

  console.log("ID do agendamento a ser excluído:", id);

  try {
    const agendamento = await Agendamento.findByIdAndDelete(id);
    if (!agendamento) {
      console.log("Agendamento não encontrado:", id);
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    console.log("Agendamento excluído com sucesso:", agendamento);
    res.status(200).json({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    res.status(500).json({ message: "Erro ao excluir agendamento", error });
  }
};

// Listar todos os agendamentos
exports.listarTodosAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    console.log("Todos os agendamentos encontrados:", agendamentos);
    res.status(200).json(agendamentos);
  } catch (error) {
    console.error("Erro ao listar todos os agendamentos:", error);
    res.status(500).json({ message: "Erro ao listar todos os agendamentos", error });
  }
};

// Listar agendamentos
exports.listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    console.log("Agendamentos encontrados:", agendamentos);
    res.status(200).json(agendamentos);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    res.status(500).json({ message: "Erro ao listar agendamentos", error });
  }
};









exports.atualizarEtapaAgendamento = async (req, res) => {
  const { id } = req.params;
  const { novaEtapa } = req.body;

  try {
    // Valida se a nova etapa é válida
    if (!["Consultou - Comprou", "Consultou - Comprou em Outra Ótica", "Consultou - Não Comprou", "Não Consultou ainda", "Desistiu"].includes(novaEtapa)) {
      return res.status(400).json({ message: "Etapa inválida" });
    }

    // Atualiza a etapa no banco de dados
    const agendamento = await Agendamento.findByIdAndUpdate(id, { etapa: novaEtapa }, { new: true });

    if (!agendamento) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    // Resposta de sucesso
    return res.status(200).json({ message: "Etapa atualizada com sucesso", agendamento });
  } catch (error) {
    console.error("Erro ao atualizar etapa do agendamento:", error);
    return res.status(500).json({ message: "Erro ao atualizar etapa do agendamento", error });
  }
};




exports.adicionarOcorrencia = async (req, res) => {
  const { id } = req.params; // ID do agendamento
  const { mensagem } = req.body; // Mensagem da ocorrência, que pode ser um objeto

  console.log("Dados recebidos para adicionar ocorrência:", { id, mensagem });

  try {
    // Verificar se a mensagem está presente e se é um objeto ou uma string
    const textoMensagem = typeof mensagem === 'string' ? mensagem : mensagem.mensagem;

    // Verificar se a mensagem é válida e se não está vazia
    if (!textoMensagem || typeof textoMensagem !== 'string' || textoMensagem.trim() === "") {
      console.log("Mensagem da ocorrência não fornecida");
      return res.status(400).json({ message: "A mensagem da ocorrência é obrigatória." });
    }

    // Encontrar o agendamento pelo ID
    const agendamento = await Agendamento.findById(id);
    if (!agendamento) {
      console.log("Agendamento não encontrado:", id);
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    // Verificar se o usuário está autenticado
    if (!req.user || !req.user.username) {
      console.log("Usuário não autenticado ou campo 'username' ausente:", req.user);
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // Criar uma nova ocorrência com o username do usuário
    const novaOcorrencia = {
      mensagem: textoMensagem.trim(), // Certifique-se de que é uma string e está formatada corretamente
      data: moment().tz("America/Sao_Paulo").toDate(),
      nomeUsuario: req.user.username, // Usa 'username' ao invés de 'nome'
    };

    // Adicionar a ocorrência ao agendamento
    agendamento.ocorrencias.push(novaOcorrencia);
    await agendamento.save();

    console.log("Ocorrência adicionada com sucesso:", novaOcorrencia);
    res.status(201).json({
      message: "Ocorrência adicionada com sucesso.",
      ocorrencia: novaOcorrencia,
    });
  } catch (error) {
    console.error("Erro ao adicionar ocorrência:", error);
    res.status(500).json({ message: "Erro ao adicionar ocorrência.", error });
  }
};
