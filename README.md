# AcervoHub

Plataforma full stack para gestao de acervo pessoal: permite cadastrar, consultar, editar e remover livros, acompanhar status de leitura (quero ler, lendo, lido), registrar avaliacao, marcar favoritos e organizar o historico em uma interface React integrada a uma API REST em Node.js/Express com persistencia em MongoDB.

## Visao geral

O projeto esta dividido em dois apps:

- `biblioteca-backend`: API REST com Express + Mongoose.
- `biblioteca-frontend`: interface React com Material UI.

## Funcionalidades atuais

- Sistema completo de Autenticação (Login, Cadastro com hash bcrypt, JWT).
- Bibliotecas Privadas: Isolamento de dados no banco (cada usuário acessa e gerencia apenas seu próprio acervo).
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

Backend padrão configurado na porta `3001` (`http://localhost:3001`).

### 2. Frontend

Na pasta `biblioteca-frontend`:

```bash
npm install
npm start
```

Frontend padrão rodando em `http://localhost:3000`.

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
- `PORT`: porta da API (recomendado `3001` local).

### Frontend

- `REACT_APP_API_URL`: URL da API.
	- fallback local: `http://localhost:3001`

## API

### `GET /`

Health-check simples:

```json
{ "status": "ok" }
```

### `GET /livros`

Retorna todos os livros do usuário autenticado. Requer cabeçalho `Authorization: Bearer <token>`.

### `POST /livros`

Cria um livro no acervo privado do usuário autenticado. Requer cabeçalho `Authorization: Bearer <token>`.

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

Remove um livro do usuário autenticado pelo identificador. Requer cabeçalho `Authorization: Bearer <token>`.

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
d
### Alternativa de deploy no Render

1. Publicar o backend como Web Service usando `biblioteca-backend`.
2. Configurar `MONGODB_URI` e `CORS_ORIGIN`.
3. Publicar o frontend como Static Site usando `biblioteca-frontend`.
4. Configurar `REACT_APP_API_URL` com a URL publica do backend.

## Observacoes

- Se o MongoDB nao estiver acessivel, a API responde erro de indisponibilidade para rotas que dependem de banco.
- Em producao, sempre definir `CORS_ORIGIN` para restringir origem permitida.

## API de Autenticação – AcervoHub

Este documento descreve as rotas de autenticação do backend do AcervoHub, exemplos de uso e payloads esperados.

---

### Cadastro de Usuário
**POST /auth/cadastro**

Body (JSON):
```
{
  "nome": "João da Silva",
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```
Resposta:
- 201: { "mensagem": "Usuário cadastrado com sucesso." }
- 409: { "erro": "E-mail já cadastrado." }

---

### Login
**POST /auth/login**

Body (JSON):
```
{
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```
Se 2FA estiver ativado, inclua:
```
{
  "codigo2fa": "123456"
}
```
Resposta:
- 200: { "token": "JWT_AQUI", "usuario": { ... } }
- 401: { "erro": "Credenciais inválidas." }

---

### Ativar 2FA
**POST /auth/ativar-2fa**

Body (JSON):
```
{
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```
Resposta:
- 200: { "secret": "BASE32SECRET", "otpauth_url": "otpauth://..." }

---

### Confirmar 2FA
**POST /auth/confirmar-2fa**

Body (JSON):
```
{
  "email": "joao@email.com",
  "senha": "senhaSegura123",
  "codigo2fa": "123456"
}
```
Resposta:
- 200: { "mensagem": "2FA ativado com sucesso." }

---

### Desativar 2FA
**POST /auth/desativar-2fa**

Body (JSON):
```
{
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```
Resposta:
- 200: { "mensagem": "2FA desativado." }

---

### Promover usuário a admin
**PATCH /auth/promover-admin**

- Apenas um admin autenticado pode acessar esta rota.
- Envie o token JWT de admin no header Authorization.

Body (JSON):
```
{
  "email": "usuario@email.com"
}
```
Resposta:
- 200: { "mensagem": "Usuário usuario@email.com promovido a admin com sucesso." }
- 404: { "erro": "Usuário não encontrado." }
- 403: { "erro": "Acesso negado: permissão insuficiente." }

---

### Observações de Autenticação
- Para rotas protegidas (ex: criar, editar, deletar livros), envie o header:
  Authorization: Bearer JWT_AQUI
- Qualquer usuário autenticado tem permissão para criar, editar e excluir os SEUS próprios livros.
- O JWT é válido por 2 horas.
