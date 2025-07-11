// controllers/authController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res) => {
  try {
    console.log("Recebido para registro:", req.body);

    const { username, password, numeroTelefone, role } = req.body;

    if (!username || !password || !numeroTelefone || !role) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const senhaCriptografada = await bcrypt.hash(password, 10);

    const usuario = new Usuario({
      username,
      password: senhaCriptografada,
      numeroTelefone, // Adicionando o número de telefone no banco de dados
      role,
    });

    await usuario.save();

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({
      message: "Erro no servidor ao tentar registrar",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Tentativa de login:", { username });

    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      console.log("Usuário não encontrado:", username);
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      console.log("Senha inválida para o usuário:", username);
      return res.status(400).json({ message: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: usuario._id, role: usuario.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    console.log("Token gerado:", token);

    res.status(200).json({ token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({
      message: "Erro no servidor ao tentar login",
      error: err.message,
    });
  }
};

// controllers/authController.js

// Função para verificar o papel (role) do usuário
exports.verificarRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const { role } = req.user; // Supondo que req.user já tenha sido populado pelo middleware de autenticação
    if (rolesPermitidos.includes(role)) {
      return next();
    } else {
      return res.status(403).json({ message: "Acesso negado." });
    }
  };
};
