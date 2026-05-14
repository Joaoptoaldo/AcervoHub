// modelo de usuário para o sistema de autenticação e gerenciamento de usuários
const mongoose = require('mongoose');

// schema com validações de segurança (email único, 2fa, role)
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório.'],
    trim: true
  },
  // email unico em minusculas com validacao de formato
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'E-mail inválido.']
  },
  // senha com hash bcrypt aplicado antes de salvar
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória.'],
    minlength: [8, 'A senha deve ter pelo menos 8 caracteres.']
  },
  // controle de permissoes: admin ou usuario comum
  role: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  },
  // autenticacao em dois fatores (TOTP com speakeasy)
  twoFA: {
    ativado: { type: Boolean, default: false },
    secret: { type: String, default: '' }
  },
  verificado: {
    type: Boolean,
    default: false
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
