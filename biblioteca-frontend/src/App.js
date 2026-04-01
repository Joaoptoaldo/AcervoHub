import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Card, CardContent, Typography } from '@mui/material';
function App() {
  const [livros, setLivros] = useState([]);
  const [form, setForm] = useState({ titulo: '', autor: '', ano: '', genero: '' });


  // Carregar livros
  useEffect(() => {
    fetch('http://localhost:3000/livros')
      .then(res => res.json())
      .then(data => setLivros(data));
  }, []);

  
  // Adicionar livro
  const adicionarLivro = async () => {
    await fetch('http://localhost:3000/livros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ titulo: '', autor: '', ano: '', genero: '' });
    const res = await fetch('http://localhost:3000/livros');
    setLivros(await res.json());
  };
  return (
    <Container>
      <h1>Biblioteca Digital</h1>
      <TextField label="Título" value={form.titulo} onChange={e => setForm({
        ...form, titulo:
          e.target.value
      })} />
      <TextField label="Autor" value={form.autor} onChange={e => setForm({
        ...form, autor:
          e.target.value
      })} />
      <TextField label="Ano" type="number" value={form.ano} onChange={e => setForm({
        ...form,
        ano: e.target.value
      })} />
      <TextField label="Gênero" value={form.genero} onChange={e => setForm({
        ...form, genero:
          e.target.value
      })} />
      <Button variant="contained" onClick={adicionarLivro}>Salvar</Button>
      {livros.map((l, i) => (
        <Card key={i} style={{ marginTop: '10px' }}>
          <CardContent>
            <Typography variant="h6">{l.titulo}</Typography>
            <Typography>{l.autor} - {l.ano} ({l.genero})</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default App;