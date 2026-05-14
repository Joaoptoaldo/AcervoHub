
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'E-mail inválido.']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória.'],
    minlength: [8, 'A senha deve ter pelo menos 8 caracteres.']
  },
  role: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  },
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
