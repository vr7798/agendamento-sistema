const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

exports.proteger = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token encontrado:", token);
  }

  if (!token) {
    console.log("Token não encontrado");
    return res.redirect("/"); // Redireciona para a página "/"
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);

    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      console.log("Usuário não encontrado para o ID decodificado:", decoded.id);
      return res.redirect("/"); // Redireciona para a página "/"
    }

    req.user = usuario;
    console.log("Usuário autenticado:", req.user);

    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    if (err.name === "TokenExpiredError") {
      return res.redirect("/");
    } else {
      return res.status(401).json({ message: "Token inválido" });
    }
  }
};
