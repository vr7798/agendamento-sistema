// routes/authRoutes.js
const express = require("express");
const { registrar, login } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/registrar",
  (req, res, next) => {
    console.log("Rota de registro acessada");
    next();
  },
  registrar
);

router.post(
  "/login",
  (req, res, next) => {
    console.log("Rota de login acessada");
    next();
  },
  login
);

module.exports = router;
