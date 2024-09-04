const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

exports.proteger = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Não autorizado, token não encontrado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Usuario.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    res.status(401).json({ message: "Token inválido" });
  }
};
