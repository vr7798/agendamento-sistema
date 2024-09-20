const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

exports.proteger = async (req, res, next) => {
  let token;

  // Verifica se o cabeçalho Authorization está presente e começa com "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token encontrado:", token);
  }

  // Se o token não for encontrado, retorna erro 401
  if (!token) {
    console.log("Token não encontrado");
    return res
      .status(401)
      .json({ message: "Não autorizado, token não encontrado" });
  }

  try {
    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);

    // Busca o usuário pelo ID decodificado e exclui a senha do objeto retornado
    const usuario = await Usuario.findById(decoded.id).select("-password");

    // Se o usuário não for encontrado, retorna erro 401
    if (!usuario) {
      console.log("Usuário não encontrado para o ID decodificado:", decoded.id);
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Anexa o usuário ao objeto req
    req.user = usuario;
    console.log("Usuário autenticado:", req.user);

    // Passa para o próximo middleware ou rota
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    res.status(401).json({ message: "Token inválido" });
  }
};
