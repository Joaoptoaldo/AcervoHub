const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const { getJwtSecret } = require('./jwt.config');

const { autenticarJWT, autorizarRole } = require('./auth.middleware');
const User = require('./user.model');

const router = express.Router();

// cria nova conta de usuario
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    // criptografa senha com bcrypt antes de salvar
    const hashSenha = await bcrypt.hash(senha, 12);

    const novoUsuario = new User({ nome, email, senha: hashSenha });
    await novoUsuario.save();

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
});

// autentica usuario e retorna token jwt
router.post('/login', async (req, res) => {
  try {
    const { email, senha, codigo2fa } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // compara senha fornecida com hash no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // se usuario tem 2fa ativado, valida codigo
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

    // gera token jwt com dados do usuario (expira em 2h)
    const token = jwt.sign(
      {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      },
      getJwtSecret(),
      { expiresIn: '2h' }
    );

    res.json({ token, usuario: { nome: usuario.nome, email: usuario.email, role: usuario.role } });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao autenticar.' });
  }
});

router.post('/ativar-2fa', async (req, res) => {
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
    // gera secret base32 e url otpauth para ler no app autenticador
    const secret = speakeasy.generateSecret({ name: `AcervoHub (${usuario.email})` });
    usuario.twoFA.ativado = false;
    usuario.twoFA.secret = secret.base32;
    await usuario.save();
    res.json({ secret: secret.base32, otpauth_url: secret.otpauth_url });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao ativar 2FA.' });
  }
});

// ativa 2fa apos validar codigo totp
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
// desativa 2fa do usuario

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

// retorna dados do usuario autenticado (sem senha ou 2fa por seguranca)
router.get('/me', autenticarJWT, async (req, res) => {
  try {
    // busca usuario e exclui campos sensíveis
    const usuario = await User.findById(req.usuario.id).select('-senha -twoFA');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuário.' });
  }
});

// promove usuario para admin (apenas admin pode fazer)
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
