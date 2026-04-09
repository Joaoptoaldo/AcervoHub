import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';


const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const PUBLIC_URL = process.env.PUBLIC_URL || '';


function App() {
  const [livros, setLivros] = useState([]);
  const [form, setForm] = useState({ titulo: '', autor: '', ano: '', genero: '' });


  // Carregar livros
  useEffect(() => {
    fetch(`${API_BASE_URL}/livros`)
      .then(res => res.json())
      .then(data => setLivros(data));
  }, []);

  
  // Adicionar livro
  const adicionarLivro = async (event) => {
    event.preventDefault();

    await fetch(`${API_BASE_URL}/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ titulo: '', autor: '', ano: '', genero: '' });
    const res = await fetch(`${API_BASE_URL}/livros`);
    setLivros(await res.json());
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
              livros cadastrados no banco de dados local.
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
                  fullWidth
                />
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
                {livros.length === 0 ? (
                  <Box className="empty-state">
                    <Typography variant="h6">Nenhum livro cadastrado ainda</Typography>
                    <Typography>
                      Use o formulário ao lado para adicionar o primeiro item do acervo.
                    </Typography>
                  </Box>
                ) : (
                  livros.map((livro, index) => (
                    <Card key={index} className="book-card" variant="outlined">
                      <CardContent className="book-card-content">
                        <Box className="book-main">
                          <Typography variant="h6" className="book-title">
                            {livro.titulo}
                          </Typography>
                          <Typography className="book-author">
                            {livro.autor}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} className="book-tags" flexWrap="wrap">
                          <Chip label={livro.ano} size="small" />
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
    </Box>
  );
}

export default App;