// controllers/authController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res) => {
  try {
    console.log("Rota de registro acessada");
    console.log("Recebido no backend:", req.body); // Log para verificar o que foi recebido

    const { username, password, role } = req.body;
    console.log("Recebido para registro:", { username, password, role });

    // Verificação de formato de dados
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string"
    ) {
      console.error("Formato de dados inválido:", req.body);
      return res
        .status(400)
        .send("Erro ao registrar usuário: formato de dados inválido");
    }

    // Verificação de usuário existente
    console.log("Verificando se o usuário já existe:", username);
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      console.log("Usuário já existe:", username);
      return res.status(400).send("Usuário já existe");
    }

    // Criptografando a senha
    console.log("Criptografando a senha para o usuário:", username);
    const senhaCriptografada = await bcrypt.hash(password, 10);
    console.log("Senha criptografada:", senhaCriptografada);

    // Salvando o novo usuário
    console.log("Salvando novo usuário no banco de dados");
    const usuario = new Usuario({
      username,
      password: senhaCriptografada,
      role,
    });
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
    // Verificação de usuário existente
    console.log("Verificando usuário no banco de dados:", username);
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      console.log("Usuário não encontrado:", username);
      return res.status(400).send("Credenciais inválidas");
    }

    // Verificação da senha
    console.log("Comparando a senha para o usuário:", username);
    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      console.log("Senha inválida para o usuário:", username);
      return res.status(400).send("Credenciais inválidas");
    }

    // Gerando token JWT
    console.log("Gerando token JWT para o usuário:", username);
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
    res.status(500).send("Erro no servidor");
  }
};

// Middleware para verificar a função do usuário
exports.verificarRole = (rolesPermitidos) => (req, res, next) => {
  console.log("Verificando função do usuário:", req.user);

  const { role } = req.user; // Supondo que o token JWT já tenha sido decodificado e adicionado ao req.user

  if (!rolesPermitidos.includes(role)) {
    console.log("Acesso negado para o usuário com função:", role);
    return res.status(403).send("Acesso negado.");
  }

  console.log("Acesso permitido para o usuário com função:", role);
  next();
};
