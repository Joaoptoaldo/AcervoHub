const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Em producao (Railway), as vars vem do ambiente. Localmente, tenta carregar .env.
try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (_) {
    // dotenv e opcional em runtime; segue com variaveis de ambiente do provedor.
}

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

// Conexão com MongoDB
mongoose.set('bufferCommands', false);
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI nao definido. Configure a variavel no Railway.');
} else {
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        dbName: 'Livro'
    })
        .then(() => console.log('MongoDB conectado com sucesso'))
        .catch((error) => console.error('Erro ao conectar no MongoDB:', error.message));
}

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
const livroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Titulo e obrigatorio.'],
        trim: true
    },
    autor: {
        type: String,
        required: [true, 'Autor e obrigatorio.'],
        trim: true
    },
    ano: {
        type: Number,
        required: [true, 'Ano e obrigatorio.'],
        min: [1, 'Ano deve ser maior ou igual a 1.'],
        validate: {
            validator: Number.isInteger,
            message: 'Ano deve ser um numero inteiro.'
        }
    },
    era: {
        type: String,
        enum: ['AC', 'DC'],
        default: 'DC'
    },
    genero: {
        type: String,
        required: [true, 'Genero e obrigatorio.'],
        trim: true
    },
    descricao: {
        type: String,
        trim: true,
        default: ''
    },
    nota: {
        type: Number,
        min: [1, 'Nota deve ser maior ou igual a 1.'],
        max: [5, 'Nota deve ser menor ou igual a 5.'],
        validate: {
            validator: (valor) => valor == null || (Number.isFinite(valor) && Math.round(valor * 2) === valor * 2),
            message: 'Nota deve ser informada em incrementos de 0.5.'
        }
    },
    dataLeitura: {
        type: Date
    },
    statusLeitura: {
        type: String,
        enum: ['QUERO_LER', 'LENDO', 'LIDO'],
        default: 'QUERO_LER'
    },
    favorito: {
        type: Boolean,
        default: false
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
});

livroSchema.pre('validate', function () {
    if (typeof this.ano === 'string') {
        const anoParseado = Number.parseInt(this.ano, 10);
        this.ano = Number.isNaN(anoParseado) ? this.ano : anoParseado;
    }

    if (typeof this.era === 'string') {
        this.era = this.era.trim().toUpperCase();
    }

    if (typeof this.nota === 'string') {
        const notaParseada = Number.parseFloat(this.nota);
        this.nota = Number.isNaN(notaParseada) ? this.nota : notaParseada;
    }

    if (typeof this.statusLeitura === 'string') {
        this.statusLeitura = this.statusLeitura.trim().toUpperCase();
    }

    if (typeof this.descricao === 'string') {
        this.descricao = this.descricao.trim();
    }

    if (typeof this.favorito === 'string') {
        this.favorito = this.favorito === 'true';
    }
});

const Livro = mongoose.model('Livro', livroSchema);


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
        console.error('Erro ao salvar livro:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                erro: Object.values(error.errors)
                    .map((item) => item.message)
                    .join(' ')
            });
        }

        res.status(500).json({ erro: 'Erro ao salvar livro.' });
    }
});

app.put('/livros/:id', ensureDatabaseConnection, async (req, res) => {
    try {
        const livroAtualizado = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!livroAtualizado) {
            return res.status(404).json({ erro: 'Livro nao encontrado.' });
        }

        res.json(livroAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                erro: Object.values(error.errors)
                    .map((item) => item.message)
                    .join(' ')
            });
        }

        res.status(500).json({ erro: 'Erro ao atualizar livro.' });
    }
});

app.delete('/livros/:id', ensureDatabaseConnection, async (req, res) => {
    try {
        const livroRemovido = await Livro.findByIdAndDelete(req.params.id);

        if (!livroRemovido) {
            return res.status(404).json({ erro: 'Livro nao encontrado.' });
        }

        res.json({ mensagem: 'Livro removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao excluir livro.' });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));