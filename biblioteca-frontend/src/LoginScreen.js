import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

const PUBLIC_URL = process.env.PUBLIC_URL || '';

const LoginScreen = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', senha: '', nome: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const endpoint = isLogin ? '/auth/login' : '/auth/cadastro';

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email: form.email, senha: form.senha } : form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro na autenticação');
      }

      if (isLogin && data.token) {
        localStorage.setItem('acervo_token', data.token);
        onSuccess(data.token);
      } else {
        setIsLogin(true);
        setError('');
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="app-shell" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Paper className="section-card form-card" elevation={0} sx={{ height: 'auto', p: 4 }}>
          <Box className="section-header">
            <Box className="section-title-wrap">
              <Box
                component="img"
                src={`${PUBLIC_URL}/bookmarks.svg`}
                alt="Ícone"
                className="section-title-icon"
              />
              <Typography variant="h5" className="section-title">
                {isLogin ? 'Acessar AcervoHub' : 'Criar Conta'}
              </Typography>
            </Box>
            <Typography className="section-caption">
              {isLogin ? 'Acesse sua conta para continuar' : 'Crie sua conta no AcervoHub'}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} className="form-stack">
            {!isLogin && (
              <TextField
                label="Nome completo"
                name="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                fullWidth
                required
              />
            )}
            <TextField
              label="E-mail"
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Senha"
              type="password"
              name="senha"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              fullWidth
              required
            />

            {error && (
              <Alert severity="error" sx={{ mt: 1, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              className="submit-button"
              fullWidth
              disabled={loading || !form.email || !form.senha}
            >
              {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </Button>
          </Box>

          <Divider className="section-divider" sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              color="primary"
              sx={{ color: '#7b4d25', fontWeight: 700 }}
            >
              {isLogin ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginScreen;
