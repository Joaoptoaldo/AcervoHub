const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('./jwt.config');

function autenticarJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  jwt.verify(token, getJwtSecret(), (err, usuario) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido.' });
    }
    req.usuario = usuario;
    next();
  });
}

function autorizarRole(roleNecessaria) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.role !== roleNecessaria) {
      return res.status(403).json({ erro: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
}

module.exports = { autenticarJWT, autorizarRole };
