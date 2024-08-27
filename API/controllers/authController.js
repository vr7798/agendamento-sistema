// controllers/authController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifica se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res.status(400).send("Usuário já existe");
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(password, 10);

    // Cria um novo usuário
    const usuario = new Usuario({ username, password: senhaCriptografada });
    await usuario.save();

    res.status(201).send("Usuário registrado com sucesso");
  } catch (err) {
    res.status(400).send("Erro ao registrar usuário");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      return res.status(400).send("Credenciais inválidas");
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(400).send("Credenciais inválidas");
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send("Erro no servidor");
  }
};
