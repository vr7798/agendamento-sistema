// routes/userRoutes.js
const express = require("express");
const {
  listarUsuarios,
  atualizarUsuario,
  excluirUsuario,
} = require("../controllers/userController");
const { proteger } = require("../middleware/authMiddleware");
const { verificarRole } = require("../controllers/authController"); // Importação correta

const router = express.Router();

// Rotas protegidas para gerenciamento de usuários
router.get("/", proteger, verificarRole(["admin"]), listarUsuarios);
router.put("/:id", proteger, verificarRole(["admin"]), atualizarUsuario);
router.delete("/:id", proteger, verificarRole(["admin"]), excluirUsuario);

module.exports = router;
