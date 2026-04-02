# Biblioteca

Aplicação simples para cadastro e listagem de livros integrando banco de dados com frontend e backend, desenvolvido em conjunto com os conhecimentos adquiridos na disciplina Implementação de Banco de Dados, e o sistema é dividido em duas partes:

- `biblioteca-backend`: API em Node.js com Express e MongoDB.
- `biblioteca-frontend`: interface em React com Material UI.

## Funcionalidades

- Listar livros cadastrados.
- Cadastrar novos livros com título, autor, ano e gênero.
- Persistir os dados em MongoDB local.

## Tecnologias

- React 19
- Material UI
- Node.js
- Express
- Mongoose
- MongoDB

## Pré-requisitos

- Node.js e npm instalados.
- MongoDB rodando localmente.

O backend usa a base `BibliotecaDigital` em `mongodb://127.0.0.1:27017/BibliotecaDigital`.

## Estrutura dos dados

Cada livro possui os campos abaixo:

- `titulo`
- `autor`
- `ano`
- `genero`

## Como executar

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

## API

### `GET /livros`

Retorna todos os livros cadastrados.

### `POST /livros`

Cria um novo livro.

Exemplo de corpo da requisição:

```json
{
	"titulo": "Dom Casmurro",
	"autor": "Machado de Assis",
	"ano": 1899,
	"genero": "Romance"
}
```

## Observações

- O frontend consome a API em `http://localhost:3000/livros`.
- Se o MongoDB não estiver ativo, o backend não conseguirá salvar ou carregar os livros.
- O backend atual expõe apenas as rotas `GET /livros` e `POST /livros`.
