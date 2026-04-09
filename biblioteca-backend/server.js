const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

// Conexão com MongoDB
require('dotenv').config({ path: path.join(__dirname, '.env') });
mongoose.set('bufferCommands', false);

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    dbName: 'Livro'
})
    .then(() => console.log('MongoDB conectado com sucesso'))
    .catch((error) => console.error('Erro ao conectar no MongoDB:', error.message));

function isDatabaseConnected() {
    return mongoose.connection.readyState === 1;
}

function ensureDatabaseConnection(req, res, next) {
    if (!isDatabaseConnected()) {
        return res.status(503).json({
            erro: 'Banco de dados indisponivel no momento. Tente novamente em instantes.'
        });
    }

    next();
}

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

// Modelo Livro
const Livro = mongoose.model('Livro', {
    titulo: String,
    autor: String,
    ano: Number,
    genero: String
});


// Rotas
app.get('/livros', ensureDatabaseConnection, async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar livros.' });
    }
});


app.post('/livros', ensureDatabaseConnection, async (req, res) => {
    try {
        const novoLivro = new Livro(req.body);
        await novoLivro.save();
        res.json(novoLivro);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao salvar livro.' });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));