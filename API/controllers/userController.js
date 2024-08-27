// controllers/userController.js
const Usuario = require("../models/Usuario");

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res.status(500).send("Erro no servidor");
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;

  try {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { username, role },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).send("Erro no servidor");
  }
};

// Excluir usuário
exports.excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.status(200).send("Usuário excluído com sucesso");
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    res.status(500).send("Erro no servidor");
  }
};
