const mongoose = require("mongoose");

const OcorrenciaSchema = new mongoose.Schema({
  mensagem: { type: String, required: true },
  data: { type: Date, default: Date.now },
  nomeUsuario: { type: String, required: true }, // Novo campo para o username do usuário
});

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
    enum: ["Consultou", "Ainda não consultou", "Desistiu"], // Define as opções disponíveis
    default: "Ainda não consultou" // Valor padrão
  },
  ocorrencias: [OcorrenciaSchema], // Novo campo para armazenar ocorrências
});

module.exports = mongoose.model("Agendamento", AgendamentoSchema);
