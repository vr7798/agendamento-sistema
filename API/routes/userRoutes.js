const express = require("express");
const {
  listarUsuarios,
  atualizarUsuario,
  excluirUsuario,
  getPerfil,
  atualizarPerfil,
} = require("../controllers/userController");
const { proteger } = require("../middleware/authMiddleware");

const router = express.Router();

// Rota para o perfil do usuário autenticado
router.get("/me", proteger, getPerfil);
router.put("/me", proteger, atualizarPerfil); // Atualizar o perfil do usuário autenticado

// Rotas para administração de outros usuários (admin only)
router.get("/", proteger, listarUsuarios);
router.put("/:id", proteger, atualizarUsuario); // Atualizar um usuário específico por ID
router.delete("/:id", proteger, excluirUsuario); // Excluir um usuário por ID

module.exports = router;
