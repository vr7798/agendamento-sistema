// controllers/authController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res) => {
  const { username, password } = req.body;
  console.log("Recebido para registro:", { username, password });

  try {
    // Verifica se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      console.log("Usuário já existe:", username);
      return res.status(400).send("Usuário já existe");
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(password, 10);
    console.log("Senha criptografada:", senhaCriptografada);

    // Cria um novo usuário
    const usuario = new Usuario({ username, password: senhaCriptografada });
    await usuario.save();
    console.log("Usuário registrado com sucesso:", usuario);

    res.status(201).send("Usuário registrado com sucesso");
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(400).send("Erro ao registrar usuário");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Tentativa de login:", { username });

  try {
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      console.log("Usuário não encontrado:", username);
      return res.status(400).send("Credenciais inválidas");
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      console.log("Senha inválida para o usuário:", username);
      return res.status(400).send("Credenciais inválidas");
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    console.log("Token gerado:", token);

    res.status(200).json({ token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).send("Erro no servidor");
  }
};
