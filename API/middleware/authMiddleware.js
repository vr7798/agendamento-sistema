const jwt = require('jsonwebtoken');

exports.proteger = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Não autorizado');
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado;
    next();
  } catch (err) {
    res.status(401).send('Token inválido');
  }
};
