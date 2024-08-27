// routes/authRoutes.js
const express = require("express");
const { registrar, login } = require("../controllers/authController");

const router = express.Router();

// Rota para registrar um novo usuário
router.post("/registrar", registrar);

// Rota para login de usuário existente
router.post("/login", login);

module.exports = router;
