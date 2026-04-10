# Biblioteca

Aplicação para cadastro e listagem de livros com frontend em React e backend em Node.js, com deploy separado no Vercel e no Railway.

O sistema é dividido em duas partes:

- `biblioteca-backend`: API em Node.js com Express e MongoDB.
- `biblioteca-frontend`: interface em React com Material UI.

## Funcionalidades

- Listar livros cadastrados.
- Cadastrar novos livros com título, autor, ano, era (a.C./d.C.) e gênero.
- Persistir os dados em MongoDB Atlas.

## Tecnologias

- React 19
- Material UI
- Node.js
- Express
- Mongoose
- MongoDB

## Pré-requisitos

- Node.js e npm instalados.
- Conta no MongoDB Atlas.
- Conta no Railway.
- Conta no Vercel.

O backend usa a base `Livro` no MongoDB definido em `MONGODB_URI`.

## Estrutura dos dados

Cada livro possui os campos abaixo:

- `titulo`
- `autor`
- `ano`
- `era` (`AC` para a.C. e `DC` para d.C.)
- `genero`
- `dataCadastro`

## Como executar localmente

### 1. Iniciar o backend

No diretório `biblioteca-backend`:

```bash
npm install
node server.js
```

O servidor sobe em `http://localhost:3000`.

### 2. Iniciar o frontend

No diretório `biblioteca-frontend`:

```bash
npm install
npm start
```

Se a porta 3000 estiver ocupada pelo backend, o React normalmente solicita outra porta disponível, geralmente `3001`.

No modo local, o frontend usa `http://localhost:3000` por padrão. Se quiser apontar para outra API, defina `REACT_APP_API_URL`.

## Deploy na web

### Backend no Railway

1. Crie um projeto no Railway apontando para a pasta `biblioteca-backend`.
2. Configure as variáveis de ambiente:
	- `MONGODB_URI` com a string do MongoDB Atlas
	- `CORS_ORIGIN` com a URL do frontend publicado no Vercel
3. O Railway vai executar `npm start` automaticamente.
4. Use a URL pública do backend, por exemplo `https://seu-backend.up.railway.app`.

### Frontend no Vercel

1. Crie um projeto no Vercel apontando para a pasta `biblioteca-frontend`.
2. Configure a variável de ambiente:
	- `REACT_APP_API_URL` com a URL do backend no Railway
3. Build command: `npm run build`
4. Output directory: `build`

Exemplo:

- Frontend: `https://seu-projeto.vercel.app`
- Backend: `https://seu-backend.up.railway.app`

O frontend consome a API em `REACT_APP_API_URL` e deixa de depender de `localhost`.

## Variáveis de ambiente

### Backend

- `MONGODB_URI`: string de conexão do MongoDB Atlas.
- `CORS_ORIGIN`: URL do frontend no Vercel.
- `PORT`: definida automaticamente pelo Railway.

### Frontend

- `REACT_APP_API_URL`: URL pública do backend no Railway.

## API

### `GET /livros`

Retorna todos os livros cadastrados.

### `POST /livros`

Cria um novo livro.
O campo `dataCadastro` é preenchido automaticamente no momento do salvamento.

Exemplo de corpo da requisição:

```json
{
	"titulo": "Dom Casmurro",
	"autor": "Machado de Assis",
	"ano": 1899,
	"era": "DC",
	"genero": "Romance"
}
```

Regras de validacao do backend:

- `ano` deve ser inteiro e maior ou igual a `1`.
- `era` aceita apenas `AC` (antes de Cristo) ou `DC` (depois de Cristo).

## Observações

- O frontend usa `REACT_APP_API_URL` em produção e `http://localhost:3000` como fallback local.
- Se o MongoDB Atlas não estiver acessível, o backend não conseguirá salvar ou carregar os livros.
- O backend atual expõe apenas as rotas `GET /livros` e `POST /livros`.
