// models/Agendamento.js
const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("Agendamento", AgendamentoSchema);
