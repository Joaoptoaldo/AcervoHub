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
  Rating,
  Skeleton,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import './App.css';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const STATUS_OPTIONS = [
  { value: 'QUERO_LER', label: 'quero ler' },
  { value: 'LENDO', label: 'lendo' },
  { value: 'LIDO', label: 'lido' },
];

const LIST_FILTER_OPTIONS = [
  { value: 'ALL', label: 'todos' },
  { value: 'LENDO', label: 'lendo' },
  { value: 'LIDO', label: 'lidos' },
  { value: 'QUERO_LER', label: 'quero ler' },
];

const getLabelStatusLeitura = (statusLeitura) => {
  const statusNormalizado = (statusLeitura || 'QUERO_LER').toUpperCase();
  const encontrado = STATUS_OPTIONS.find((item) => item.value === statusNormalizado);
  return encontrado ? encontrado.label : 'quero ler';
};

const getClasseNota = (nota) => {
  if (typeof nota !== 'number') {
    return 'rating-tier-unrated';
  }

  if (nota >= 4.5) {
    return 'rating-tier-high';
  }

  if (nota >= 3) {
    return 'rating-tier-mid';
  }

  return 'rating-tier-low';
};

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

const formatarDataLeitura = (dataLeitura) => {
  if (!dataLeitura) {
    return 'Data de leitura nao informada';
  }

  const data = new Date(dataLeitura);

  if (Number.isNaN(data.getTime())) {
    return 'Data de leitura nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(data);
};

const truncarDescricao = (descricao, limite = 140) => {
  if (!descricao || descricao.length <= limite) {
    return descricao;
  }

  return `${descricao.slice(0, limite).trimEnd()}...`;
};


function App() {
  const [livros, setLivros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    ano: '',
    era: 'DC',
    genero: '',
    descricao: '',
    nota: '',
    statusLeitura: '',
    dataLeitura: '',
    favorito: false,
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [filtroLista, setFiltroLista] = useState('ALL');

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

  // Adicionar ou atualizar livro
  const adicionarOuAtualizarLivro = async (event) => {
    event.preventDefault();

    const anoNormalizado = Number.parseInt(form.ano, 10);
    const statusLeituraNormalizado = (form.statusLeitura || 'QUERO_LER').toUpperCase();
    const notaNormalizada = form.nota === '' ? null : Number.parseFloat(form.nota);

    if (!Number.isInteger(anoNormalizado) || anoNormalizado < 1) {
      window.alert('Informe um ano inteiro maior ou igual a 1 e selecione a era correta (a.C. ou d.C.).');
      return;
    }

    if (form.nota !== '' && (!Number.isFinite(notaNormalizada) || notaNormalizada < 1 || notaNormalizada > 5)) {
      window.alert('Informe uma nota entre 1 e 5.');
      return;
    }

    if (form.nota !== '' && Math.round(notaNormalizada * 2) !== notaNormalizada * 2) {
      window.alert('A nota deve ser informada em passos de 0.5.');
      return;
    }

    const payload = {
      ...form,
      ano: anoNormalizado,
      era: form.era || 'DC',
      nota: notaNormalizada,
      dataLeitura: statusLeituraNormalizado === 'LIDO' ? (form.dataLeitura || null) : null,
      statusLeitura: statusLeituraNormalizado,
      favorito: Boolean(form.favorito),
      descricao: (form.descricao || '').trim(),
    };

    try {
      const url = editandoId ? `${API_BASE_URL}/livros/${editandoId}` : `${API_BASE_URL}/livros`;
      const method = editandoId ? 'PUT' : 'POST';
      
      const resposta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        window.alert(erro.erro || (editandoId ? 'Nao foi possivel atualizar o livro.' : 'Nao foi possivel salvar o livro.'));
        return;
      }

      setForm({
        titulo: '',
        autor: '',
        ano: '',
        era: 'DC',
        genero: '',
        descricao: '',
        nota: '',
        statusLeitura: '',
        dataLeitura: '',
        favorito: false,
      });
      setEditandoId(null);
      await carregarLivros({ mostrarErro: true });
      exibirFeedback(editandoId ? 'Livro atualizado com sucesso.' : 'Livro salvo com sucesso.');
    } catch (error) {
      exibirFeedback(editandoId ? 'Nao foi possivel atualizar o livro.' : 'Nao foi possivel salvar o livro.', 'error');
    }
  };

  const alternarDescricao = (livroId) => {
    setExpandedDescriptions((estadoAtual) => ({
      ...estadoAtual,
      [livroId]: !estadoAtual[livroId],
    }));
  };

  const editarLivro = (livro) => {
    setForm({
      titulo: livro.titulo,
      autor: livro.autor,
      ano: String(livro.ano),
      era: livro.era || 'DC',
      genero: livro.genero,
      descricao: livro.descricao || '',
      nota: livro.nota ? String(livro.nota) : '',
      statusLeitura: livro.statusLeitura || '',
      dataLeitura: livro.dataLeitura ? new Date(livro.dataLeitura).toISOString().split('T')[0] : '',
      favorito: livro.favorito || false,
    });
    setEditandoId(livro._id);
    document.querySelector('.form-stack')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelarEdicao = () => {
    setForm({
      titulo: '',
      autor: '',
      ano: '',
      era: 'DC',
      genero: '',
      descricao: '',
      nota: '',
      statusLeitura: '',
      dataLeitura: '',
      favorito: false,
    });
    setEditandoId(null);
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

  const livrosFiltrados = livros.filter((livro) => {
    if (filtroLista === 'ALL') {
      return true;
    }

    return (livro.statusLeitura || 'QUERO_LER').toUpperCase() === filtroLista;
  });

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
              Organize, avalie e acompanhe seus livros em um só lugar
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

        <Grid container spacing={0} className="content-grid">
          <Grid xs={12} md={6} lg={6}>
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
                    {editandoId ? 'Editar livro' : 'Novo livro'}
                  </Typography>
                </Box>
                <Typography className="section-caption">
                  {editandoId ? 'Atualize as informações do livro abaixo.' : 'Preencha os campos abaixo para adicionar um registro.'}
                </Typography>
              </Box>

              <Box component="form" onSubmit={adicionarOuAtualizarLivro} className="form-stack">
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
                  label="Ano de publicação"
                  type="number"
                  value={form.ano}
                  onChange={(event) => setForm({ ...form, ano: event.target.value })}
                  inputProps={{ min: 1, step: 1 }}
                  helperText="Use ano positivo e selecione a era abaixo"
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
                <TextField
                  label="Descrição"
                  value={form.descricao}
                  onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                  multiline
                  minRows={3}
                  helperText="Resumo livre sobre a obra (opcional)"
                  fullWidth
                />

                <Box className="rating-input-wrap">
                  <Typography className="rating-input-label">Nota (1 a 5)</Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Rating
                      value={form.nota === '' ? null : Number(form.nota)}
                      precision={0.5}
                      onChange={(_, value) => {
                        setForm({ ...form, nota: typeof value === 'number' ? value : '' });
                      }}
                    />
                    <TextField
                      type="number"
                      value={form.nota}
                      onChange={(event) => setForm({ ...form, nota: event.target.value })}
                      inputProps={{ min: 1, max: 5, step: 0.5 }}
                      className="rating-number-input"
                      placeholder="opcional"
                    />
                  </Stack>
                </Box>

                <TextField
                  select
                  label="Status de leitura"
                  value={form.statusLeitura}
                  onChange={(event) => {
                    const novoStatus = event.target.value;
                    setForm({
                      ...form,
                      statusLeitura: novoStatus,
                      dataLeitura: novoStatus === 'LIDO' ? form.dataLeitura : '',
                    });
                  }}
                  helperText="Opcional (se nao selecionar, sera considerado 'quero ler')"
                  fullWidth
                >
                  <MenuItem value="">nao informar (quero ler)</MenuItem>
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                {form.statusLeitura === 'LIDO' ? (
                  <TextField
                    label="Data de leitura"
                    type="date"
                    value={form.dataLeitura}
                    onChange={(event) => setForm({ ...form, dataLeitura: event.target.value })}
                    InputLabelProps={{ shrink: true }}
                    helperText="Opcional para status lido"
                    fullWidth
                  />
                ) : null}

                <Box className="favorite-input-wrap">
                  <Typography className="favorite-input-label">Marcar como favorito</Typography>
                  <Switch
                    checked={Boolean(form.favorito)}
                    onChange={(event) => setForm({ ...form, favorito: event.target.checked })}
                  />
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button variant="contained" type="submit" className="submit-button" fullWidth>
                    {editandoId ? 'Atualizar livro' : 'Salvar livro'}
                  </Button>
                  {editandoId && (
                    <Button variant="outlined" type="button" onClick={cancelarEdicao} fullWidth>
                      Cancelar
                    </Button>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>

          <Grid xs={12} md={6} lg={6}>
            <Paper className="section-card list-card" elevation={0}>
              <Box className="section-header list-header">
                <Box>
                  <Box className="list-title-row">
                    <Box className="section-title-wrap">
                      <Box
                        component="img"
                        src={`${PUBLIC_URL}/collection.svg`}
                        alt="Icone de colecao"
                        className="section-title-icon"
                      />
                      <Typography variant="h5" className="section-title">
                        Acervo
                      </Typography>
                    </Box>
                    <Chip label={`${livrosFiltrados.length} itens`} className="list-chip list-chip-mobile" />
                  </Box>
                  <Typography className="section-caption">
                    Lista dos livros já armazenados na base.
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" className="list-header-actions">
                    <Stack direction="row" spacing={1} className="filter-pills" role="tablist" aria-label="Filtros de acervo">
                      {LIST_FILTER_OPTIONS.map((option) => {
                        const ativo = filtroLista === option.value;

                        return (
                          <Button
                            key={option.value}
                            variant={ativo ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setFiltroLista(option.value)}
                            className={`filter-pill ${ativo ? 'filter-pill-active' : ''}`}
                            role="tab"
                            aria-selected={ativo}
                          >
                            {option.label}
                          </Button>
                        );
                      })}
                    </Stack>
                    <Chip label={`${livrosFiltrados.length} itens`} className="list-chip list-chip-desktop" />
                  </Stack>
                </Box>
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
                ) : livrosFiltrados.length === 0 ? (
                  <Box className="empty-state">
                    <Typography variant="h6">
                      {livros.length === 0 ? 'Nenhum livro cadastrado ainda' : 'Nenhum livro encontrado nesse filtro'}
                    </Typography>
                    <Typography>
                      {livros.length === 0
                        ? 'Use o formulário ao lado para adicionar o primeiro item do acervo.'
                        : 'Altere o filtro para visualizar outros livros do acervo.'}
                    </Typography>
                  </Box>
                ) : (
                  livrosFiltrados.map((livro, index) => {
                    const descricao = (livro.descricao || '').trim();
                    const livroId = livro._id || `index-${index}`;
                    const descricaoGrande = descricao.length > 140;
                    const descricaoExpandida = Boolean(expandedDescriptions[livroId]);
                    const descricaoExibida = descricaoExpandida ? descricao : truncarDescricao(descricao, 140);
                    const notaLivro = typeof livro.nota === 'number' ? livro.nota : null;

                    return (
                      <Card
                        key={livroId}
                        className={`book-card ${getClasseNota(notaLivro)} ${livro.favorito ? 'book-card-favorite' : ''}`}
                        variant="outlined"
                      >
                        <CardContent className="book-card-content">
                        <Box className="book-actions">
                          <Box className="book-date-badge">
                            adicionado em {formatarDataCadastro(livro.dataCadastro)}
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <Button
                              variant="text"
                              size="small"
                              className="book-edit-button"
                              onClick={() => editarLivro(livro)}
                            >
                              editar
                            </Button>
                            <Button
                              variant="text"
                              size="small"
                              color="error"
                              className="book-delete-button"
                              onClick={() => excluirLivro(livro._id)}
                            >
                              excluir
                            </Button>
                          </Stack>
                        </Box>
                        <Box className="book-main">
                          <Stack direction="row" spacing={1} className="book-headline-chips" flexWrap="wrap">
                            <Chip label={getLabelStatusLeitura(livro.statusLeitura)} size="small" className="status-chip" />
                            {livro.favorito ? <Chip label="favorito" size="small" className="favorite-chip" /> : null}
                          </Stack>

                          <Typography variant="h6" className="book-title">
                            {livro.titulo}
                          </Typography>
                          <Typography className="book-author">
                            {livro.autor}
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center" className="book-rating-wrap">
                            <Rating value={notaLivro || 0} precision={0.5} readOnly />
                            <Typography className="book-rating-number">
                              {notaLivro ? `${notaLivro.toFixed(1)} / 5` : 'sem nota'}
                            </Typography>
                          </Stack>

                          <Typography className="book-reading-date">
                            leitura: {formatarDataLeitura(livro.dataLeitura)}
                          </Typography>

                          {descricao ? (
                            <Box className="book-description-wrap">
                              <Typography className="book-description">
                                {descricaoExibida}
                              </Typography>

                              {descricaoGrande ? (
                                <Button
                                  variant="text"
                                  size="small"
                                  className="book-see-more"
                                  onClick={() => alternarDescricao(livroId)}
                                >
                                  {descricaoExpandida ? 'ver menos' : 'ver mais'}
                                </Button>
                              ) : null}
                            </Box>
                          ) : null}
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
                    );
                  })
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Box component="footer" className="app-footer">
          <Typography className="app-footer-text">
            Projeto disponível no{' '}
            <a
              href="https://github.com/Joaoptoaldo/AcervoHub"
              target="_blank"
              rel="noreferrer"
              className="app-footer-link"
            >
              <span>GitHub</span>
              <Box
                component="img"
                src={`${PUBLIC_URL}/github.svg`}
                alt="GitHub"
                className="app-footer-icon"
              />
            </a>
          </Typography>
        </Box>
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