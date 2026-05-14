
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField
} from '@mui/material';

import { useState } from 'react';

const LoginModal = ({ open, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', senha: '' });
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
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro na autenticação');
      }

      if (isLogin && data.token) {
        localStorage.setItem('acervo_token', data.token);
        onSuccess(data.token);
      } else {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="modal-title">
      <DialogTitle id="modal-title">
        {isLogin ? 'Acessar AcervoHub' : 'Criar Conta'}
        <IconButton
          aria-label="fechar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          X
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {!isLogin && (
            <TextField
              label="Nome completo"
              name="nome"
              value={form.nome || ''}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              fullWidth
              margin="normal"
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
            margin="normal"
            required
          />
          <TextField
            label="Senha"
            type="password"
            name="senha"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !form.email || !form.senha}
          >
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar')}
          </Button>
        </DialogActions>
      </form>

      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          size="small"
        >
          {isLogin ? 'Criar nova conta' : 'Já tenho conta'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default LoginModal;

