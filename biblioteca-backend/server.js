const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors());

// Conexão com MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/BibliotecaDigital')
    .then(() => console.log('MongoDB conectado com sucesso'))
    .catch((error) => console.error('Erro ao conectar no MongoDB:', error.message));


// Modelo Livro
const Livro = mongoose.model('Livro', {
    titulo: String,
    autor: String,
    ano: Number,
    genero: String
});


// Rotas
app.get('/livros', async (req, res) => {
    const livros = await Livro.find();
    res.json(livros);
});


app.post('/livros', async (req, res) => {
    const novoLivro = new Livro(req.body);
    await novoLivro.save();
    res.json(novoLivro);
});


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));