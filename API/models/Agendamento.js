// models/Agendamento.js

const mongoose = require("mongoose");

// Schema para Ocorrência
const OcorrenciaSchema = new mongoose.Schema({
  mensagem: { type: String, required: true },
  data: { type: Date, default: Date.now },
  nomeUsuario: { type: String, required: true }, // Novo campo para o username do usuário
});

// Schema para Agendamento
const AgendamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  numero: { type: String, required: true },
  horario: { type: String, required: true },
  dia: { type: Date, required: true },
  local: { type: String, required: true },
  observacao: { type: String },
  etapa: { 
    type: String, 
    enum: [
      "Consultou - Comprou",
      "Consultou - Comprou em Outra Ótica",
      "Consultou - Não Comprou",
      "Não Consultou ainda",
      "Desistiu"
    ], // Define as novas opções disponíveis
    default: "Não Consultou ainda" // Valor padrão atualizado
  },
  ocorrencias: [OcorrenciaSchema], // Campo para armazenar ocorrências
});

// Exporta o modelo Agendamento
module.exports = mongoose.model("Agendamento", AgendamentoSchema);
