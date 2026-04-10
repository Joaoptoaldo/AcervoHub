# AcervoHub

Plataforma full stack para gestao de acervo pessoal: permite cadastrar, consultar, editar e remover livros, acompanhar status de leitura (quero ler, lendo, lido), registrar avaliacao, marcar favoritos e organizar o historico em uma interface React integrada a uma API REST em Node.js/Express com persistencia em MongoDB.

## Visao geral

O projeto esta dividido em dois apps:

- `biblioteca-backend`: API REST com Express + Mongoose.
- `biblioteca-frontend`: interface React com Material UI.

## Funcionalidades atuais

- Cadastro, listagem, edicao e exclusao de livros.
- Filtros rapidos por status na listagem:
	- `Todos`
	- `Lendo`
	- `Lidos`
	- `Quero ler`
- Contador de itens filtrados na listagem.
- Campos obrigatorios: titulo, autor, ano, era e genero.
- Campos opcionais:
	- descricao
	- nota (1 a 5 com passo 0.5)
	- status de leitura (`QUERO_LER`, `LENDO`, `LIDO`)
	- data de leitura
	- favorito
- Regras de formulario:
	- se o status nao for informado, o sistema assume `QUERO_LER`
	- o campo de data de leitura no frontend so aparece para status `LIDO`
- Destaque visual no card por faixa de nota e marcador de favorito.
- Interface responsiva com ajustes especificos para desktop e celular.
- Rodape com link para o projeto no GitHub.

## Stack

- React 19
- Material UI
- Node.js
- Express
- Mongoose
- MongoDB Atlas

## Modelo de dados

Cada livro pode conter:

- `titulo` (obrigatorio)
- `autor` (obrigatorio)
- `ano` (obrigatorio, inteiro >= 1)
- `era` (obrigatorio, `AC` ou `DC`)
- `genero` (obrigatorio)
- `descricao` (opcional)
- `nota` (opcional, numero entre 1 e 5 em incrementos de 0.5)
- `statusLeitura` (opcional, default `QUERO_LER`)
- `dataLeitura` (opcional)
- `favorito` (opcional, default `false`)
- `dataCadastro` (automatico)

## Como rodar localmente

### 1. Backend

Na pasta `biblioteca-backend`:

```bash
npm install
npm start
```

Backend padrao em `http://localhost:3000`.

### 2. Frontend

Na pasta `biblioteca-frontend`:

```bash
npm install
npm start
```

Se a porta 3000 estiver ocupada, o React pode subir em outra porta (geralmente `3001`).

### 3. Atalho no root

No root do repositorio:

```bash
npm start
```

Esse comando inicia apenas o backend (atalho para `npm --prefix biblioteca-backend start`).

## Variaveis de ambiente

### Backend

- `MONGODB_URI`: string de conexao do MongoDB Atlas.
- `CORS_ORIGIN`: origem permitida no CORS (URL do frontend publicado).
- `PORT`: porta da API (opcional; default local 3000).

### Frontend

- `REACT_APP_API_URL`: URL da API.
	- fallback local: `http://localhost:3000`

## API

### `GET /`

Health-check simples:

```json
{ "status": "ok" }
```

### `GET /livros`

Retorna todos os livros.

### `POST /livros`

Cria um livro.

Exemplo de payload completo:

```json
{
	"titulo": "1984",
	"autor": "George Orwell",
	"ano": 1949,
	"era": "DC",
	"genero": "Distopia",
	"descricao": "Romance distopico sobre vigilancia e controle social.",
	"nota": 4.5,
	"statusLeitura": "LIDO",
	"dataLeitura": "2026-04-10",
	"favorito": true
}
```

Payload minimo valido:

```json
{
	"titulo": "Dom Casmurro",
	"autor": "Machado de Assis",
	"ano": 1899,
	"era": "DC",
	"genero": "Romance"
}
```

### `DELETE /livros/:id`

Remove um livro pelo identificador.

## Regras de validacao (backend)

- `ano` deve ser inteiro e maior ou igual a `1`.
- `era` aceita apenas `AC` ou `DC`.
- `nota`, quando informada, deve estar entre `1` e `5` e seguir passo `0.5`.
- `statusLeitura`, quando informado, aceita apenas `QUERO_LER`, `LENDO` ou `LIDO`.

## Deploy

### Backend no Railway

1. Criar projeto apontando para `biblioteca-backend`.
2. Configurar `MONGODB_URI` e `CORS_ORIGIN`.
3. Publicar e usar a URL gerada.

### Frontend no Vercel

1. Criar projeto apontando para `biblioteca-frontend`.
2. Configurar `REACT_APP_API_URL` com a URL do backend publicado.
3. Build command: `npm run build`.
4. Output directory: `build`.

### Alternativa de deploy no Render

1. Publicar o backend como Web Service usando `biblioteca-backend`.
2. Configurar `MONGODB_URI` e `CORS_ORIGIN`.
3. Publicar o frontend como Static Site usando `biblioteca-frontend`.
4. Configurar `REACT_APP_API_URL` com a URL publica do backend.

## Observacoes

- Se o MongoDB nao estiver acessivel, a API responde erro de indisponibilidade para rotas que dependem de banco.
- Em producao, sempre definir `CORS_ORIGIN` para restringir origem permitida.
