import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import './App.css';


const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const formatarDataCadastro = (dataCadastro) => {
  if (!dataCadastro) {
    return 'Data de cadastro indisponivel';
  }

  const data = new Date(dataCadastro);

  if (Number.isNaN(data.getTime())) {
    return 'Data de cadastro indisponivel';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(data);
};


function App() {
  const [livros, setLivros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [form, setForm] = useState({ titulo: '', autor: '', ano: '', era: 'DC', genero: '' });

  const exibirFeedback = (message, severity = 'success') => {
    setFeedback({ open: true, message, severity });
  };

  const fecharFeedback = () => {
    setFeedback((estadoAtual) => ({ ...estadoAtual, open: false }));
  };

  const carregarLivros = useCallback(async ({ mostrarErro = false } = {}) => {
    try {
      const resposta = await fetch(`${API_BASE_URL}/livros`);

      if (!resposta.ok) {
        throw new Error('Falha ao buscar livros.');
      }

      const dados = await resposta.json();
      setLivros(Array.isArray(dados) ? dados : []);
    } catch (error) {
      if (mostrarErro) {
        exibirFeedback('Nao foi possivel atualizar o acervo agora.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);


  // Carregar livros
  useEffect(() => {
    carregarLivros({ mostrarErro: true });
  }, [carregarLivros]);

  
  // Adicionar livro
  const adicionarLivro = async (event) => {
    event.preventDefault();

    const anoNormalizado = Number.parseInt(form.ano, 10);

    if (!Number.isInteger(anoNormalizado) || anoNormalizado < 1) {
      window.alert('Informe um ano inteiro maior ou igual a 1 e selecione a era correta (a.C. ou d.C.).');
      return;
    }

    const payload = {
      ...form,
      ano: anoNormalizado,
      era: form.era || 'DC',
    };

    try {
      const resposta = await fetch(`${API_BASE_URL}/livros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        window.alert(erro.erro || 'Nao foi possivel salvar o livro.');
        return;
      }

      setForm({ titulo: '', autor: '', ano: '', era: 'DC', genero: '' });
      await carregarLivros({ mostrarErro: true });
      exibirFeedback('Livro salvo com sucesso.');
    } catch (error) {
      exibirFeedback('Nao foi possivel salvar o livro.', 'error');
    }
  };

  const excluirLivro = async (id) => {
    const confirmarExclusao = window.confirm('Excluir este livro permanentemente?');

    if (!confirmarExclusao) {
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/livros/${id}`, {
        method: 'DELETE',
      });

      await carregarLivros({ mostrarErro: true });
      exibirFeedback('Livro excluido com sucesso.');
    } catch (error) {
      exibirFeedback('Nao foi possivel excluir o livro.', 'error');
    }
  };

  return (
    <Box className="app-shell">
      <Container maxWidth="lg" className="app-container">
        <Box className="hero">
          <Stack spacing={2}>
            <Chip label="AcervoHub" className="hero-chip" />
            <Box className="hero-title-wrap">
              <Box
                component="img"
                src={`${PUBLIC_URL}/bookmarks.svg`}
                alt="Icone de livro"
                className="hero-title-icon"
              />
              <Typography variant="h2" className="hero-title">
                Biblioteca Digital
              </Typography>
            </Box>
            <Typography className="hero-subtitle">
              Cadastre e acompanhe livros em uma interface limpa, responsiva e direta ao ponto.
            </Typography>
          </Stack>

          <Paper className="hero-panel" elevation={0}>
            <Typography variant="overline" className="hero-panel-label">
              Resumo do acervo
            </Typography>
            <Typography variant="h3" className="hero-panel-number">
              {livros.length}
            </Typography>
            <Typography className="hero-panel-text">
              livros cadastrados no banco de dados.
            </Typography>
          </Paper>
        </Box>

        <Grid container spacing={3} className="content-grid">
          <Grid item xs={12} md={5}>
            <Paper className="section-card form-card" elevation={0}>
              <Box className="section-header">
                <Box className="section-title-wrap">
                  <Box
                    component="img"
                    src={`${PUBLIC_URL}/newbook.svg`}
                    alt="Icone de novo livro"
                    className="section-title-icon"
                  />
                  <Typography variant="h5" className="section-title">
                    Novo livro
                  </Typography>
                </Box>
                <Typography className="section-caption">
                  Preencha os campos abaixo para adicionar um registro.
                </Typography>
              </Box>

              <Box component="form" onSubmit={adicionarLivro} className="form-stack">
                <TextField
                  label="Título"
                  value={form.titulo}
                  onChange={(event) => setForm({ ...form, titulo: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Autor"
                  value={form.autor}
                  onChange={(event) => setForm({ ...form, autor: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Ano"
                  type="number"
                  value={form.ano}
                  onChange={(event) => setForm({ ...form, ano: event.target.value })}
                  inputProps={{ min: 1, step: 1 }}
                  helperText="Use ano positivo e selecione a era ao lado."
                  fullWidth
                />
                <TextField
                  select
                  label="Era"
                  value={form.era}
                  onChange={(event) => setForm({ ...form, era: event.target.value })}
                  fullWidth
                >
                  <MenuItem value="DC">d.C.</MenuItem>
                  <MenuItem value="AC">a.C.</MenuItem>
                </TextField>
                <TextField
                  label="Gênero"
                  value={form.genero}
                  onChange={(event) => setForm({ ...form, genero: event.target.value })}
                  fullWidth
                />

                <Button variant="contained" type="submit" className="submit-button" fullWidth>
                  Salvar livro
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper className="section-card list-card" elevation={0}>
              <Box className="section-header list-header">
                <Box>
                  <Typography variant="h5" className="section-title">
                    Acervo
                  </Typography>
                  <Typography className="section-caption">
                    Lista dos livros já armazenados na base.
                  </Typography>
                </Box>
                <Chip label={`${livros.length} itens`} className="list-chip" />
              </Box>

              <Divider className="section-divider" />

              <Stack spacing={2} className="books-stack">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={`skeleton-${index}`} className="book-card" variant="outlined">
                      <CardContent className="book-card-content">
                        <Skeleton variant="text" width="34%" height={22} />
                        <Skeleton variant="text" width="62%" height={34} />
                        <Skeleton variant="text" width="44%" height={24} />
                        <Stack direction="row" spacing={1}>
                          <Skeleton variant="rounded" width={84} height={24} />
                          <Skeleton variant="rounded" width={110} height={24} />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                ) : livros.length === 0 ? (
                  <Box className="empty-state">
                    <Typography variant="h6">Nenhum livro cadastrado ainda</Typography>
                    <Typography>
                      Use o formulário ao lado para adicionar o primeiro item do acervo.
                    </Typography>
                  </Box>
                ) : (
                  livros.map((livro, index) => (
                    <Card key={livro._id || index} className="book-card" variant="outlined">
                      <CardContent className="book-card-content">
                        <Box className="book-actions">
                          <Box className="book-date-badge">
                            adicionado em {formatarDataCadastro(livro.dataCadastro)}
                          </Box>
                          <Button
                            variant="text"
                            size="small"
                            color="error"
                            className="book-delete-button"
                            onClick={() => excluirLivro(livro._id)}
                          >
                            excluir
                          </Button>
                        </Box>
                        <Box className="book-main">
                          <Typography variant="h6" className="book-title">
                            {livro.titulo}
                          </Typography>
                          <Typography className="book-author">
                            {livro.autor}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} className="book-tags" flexWrap="wrap">
                          <Chip
                            label={`${livro.ano} ${(livro.era || 'DC') === 'AC' ? 'a.C.' : 'd.C.'}`}
                            size="small"
                          />
                          <Chip label={livro.genero} size="small" variant="outlined" />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={feedback.open}
        autoHideDuration={2600}
        onClose={fecharFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={fecharFeedback} severity={feedback.severity} variant="filled" sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;