const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('./jwt.config');

// middleware que valida token jwt no header authorization
function autenticarJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  // verifica assinatura e validade do token
  jwt.verify(token, getJwtSecret(), (err, usuario) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido.' });
    }
    req.usuario = usuario;
    next();
  });
}

// middleware que valida se usuario tem permissão necessária
function autorizarRole(roleNecessaria) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.role !== roleNecessaria) {
      return res.status(403).json({ erro: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
}

module.exports = { autenticarJWT, autorizarRole };
