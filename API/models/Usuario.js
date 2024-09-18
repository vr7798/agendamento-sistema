// models/Usuario.js
const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }, // Role é uma string com valores possíveis 'admin' ou 'user'
  numeroTelefone: { type: String, required: true }, // Novo campo para armazenar o número de telefone
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
