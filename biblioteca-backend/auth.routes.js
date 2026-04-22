// Rotas de autenticação para cadastro de usuário com hash de senha
// Segue boas práticas de segurança e arquitetura do AcervoHub


const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');

const { autenticarJWT, autorizarRole } = require('./auth.middleware');
const User = require('./user.model');

const router = express.Router();

// Cadastro de usuário
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    // Verifica se o e-mail já está cadastrado
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    // Gera hash da senha
    const hashSenha = await bcrypt.hash(senha, 12);

    // Cria usuário
    const novoUsuario = new User({ nome, email, senha: hashSenha });
    await novoUsuario.save();

    // Nunca retorna a senha
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
});


// Login seguro
router.post('/login', async (req, res) => {
  try {
    const { email, senha, codigo2fa } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    // Busca usuário
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // Verifica senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // Se 2FA estiver ativado, exige código e valida com speakeasy
    if (usuario.twoFA.ativado) {
      if (!codigo2fa) {
        return res.status(401).json({ erro: 'Código 2FA obrigatório.' });
      }
      const valid2fa = speakeasy.totp.verify({
        secret: usuario.twoFA.secret,
        encoding: 'base32',
        token: codigo2fa,
        window: 1
      });
      if (!valid2fa) {
        return res.status(401).json({ erro: 'Código 2FA inválido.' });
      }
    }

    // Gera JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      },
      process.env.JWT_SECRET || 'segredo-super-seguro',
      { expiresIn: '2h' }
    );

    res.json({ token, usuario: { nome: usuario.nome, email: usuario.email, role: usuario.role } });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao autenticar.' });
  }
});

// Ativar 2FA (gera secret e retorna para o usuário configurar no app autenticador)
router.post('/ativar-2fa', async (req, res) => {
  try {
    const { email, senha } = req.body;
    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }
    // Gera secret TOTP
    const secret = speakeasy.generateSecret({ name: `AcervoHub (${usuario.email})` });
    usuario.twoFA.ativado = false;
    usuario.twoFA.secret = secret.base32;
    await usuario.save();
    // Retorna secret e otpauth_url para configurar no app autenticador
    res.json({ secret: secret.base32, otpauth_url: secret.otpauth_url });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao ativar 2FA.' });
  }
});

// Confirmar ativação do 2FA (usuário informa código gerado pelo app autenticador)
router.post('/confirmar-2fa', async (req, res) => {
  try {
    const { email, senha, codigo2fa } = req.body;
    if (!email || !senha || !codigo2fa) {
      return res.status(400).json({ erro: 'E-mail, senha e código 2FA são obrigatórios.' });
    }
    const usuario = await User.findOne({ email });
    if (!usuario || !usuario.twoFA.secret) {
      return res.status(401).json({ erro: 'Usuário ou 2FA não iniciado.' });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }
    const valid2fa = speakeasy.totp.verify({
      secret: usuario.twoFA.secret,
      encoding: 'base32',
      token: codigo2fa,
      window: 1
    });
    if (!valid2fa) {
      return res.status(401).json({ erro: 'Código 2FA inválido.' });
    }
    usuario.twoFA.ativado = true;
    await usuario.save();
    res.json({ mensagem: '2FA ativado com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao confirmar 2FA.' });
  }
});

// Desativar 2FA
router.post('/desativar-2fa', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }
    usuario.twoFA.ativado = false;
    usuario.twoFA.secret = '';
    await usuario.save();
    res.json({ mensagem: '2FA desativado.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao desativar 2FA.' });
  }
});


// Promover usuário a admin (apenas admin pode promover)
// Exemplo de uso: PATCH /auth/promover-admin { email: "alvo@email.com" }
router.patch('/promover-admin', autenticarJWT, autorizarRole('admin'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ erro: 'E-mail do usuário a ser promovido é obrigatório.' });
    }
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    if (usuario.role === 'admin') {
      return res.status(200).json({ mensagem: 'Usuário já é admin.' });
    }
    usuario.role = 'admin';
    await usuario.save();
    res.json({ mensagem: `Usuário ${email} promovido a admin com sucesso.` });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao promover usuário.' });
  }
});  

module.exports = router;
