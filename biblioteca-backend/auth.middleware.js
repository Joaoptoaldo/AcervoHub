// Middleware para autenticação JWT e autorização por role
// Segue boas práticas e arquitetura do AcervoHub

const jwt = require('jsonwebtoken');

// Middleware para autenticar o token JWT
function autenticarJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'segredo-super-seguro', (err, usuario) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido.' });
    }
    req.usuario = usuario; // Disponibiliza dados do usuário autenticado na requisição
    next();
  });
}

// Middleware para autorizar por role (ex: apenas admin)
function autorizarRole(roleNecessaria) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.role !== roleNecessaria) {
      return res.status(403).json({ erro: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
}

module.exports = { autenticarJWT, autorizarRole };
