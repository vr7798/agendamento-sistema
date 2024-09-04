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
router.put("/me", proteger, atualizarPerfil); // Certifique-se de que essa rota existe

// Rotas para administrar outros usuários
router.get("/", proteger, listarUsuarios);
router.put("/:id", proteger, atualizarUsuario); // Aqui, o ID é tratado como ObjectId
router.delete("/:id", proteger, excluirUsuario);

module.exports = router;
