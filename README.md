# AcervoHub

Plataforma full stack para gestão de acervo pessoal: permite cadastrar, consultar, editar e remover livros, acompanhar status de leitura (quero ler, lendo, lido), registrar avaliação, marcar favoritos e organizar o histórico em uma interface React integrada a uma API REST em Node.js/Express com persistência em MongoDB.

## Visão geral

O projeto está dividido em dois apps:

- `biblioteca-backend`: API REST com Express + Mongoose.
- `biblioteca-frontend`: interface React com Material UI.

Para a documentação completa, consulte os links abaixo:
- [Documentação da API](docs/api.md)
- [Documentação de Autenticação](docs/auth.md)
- [Arquitetura e Modelo de Dados](docs/architecture.md)
- [Deploy e Variáveis de Ambiente](docs/deploy.md)
- [Testes](docs/testing.md)

## Funcionalidades atuais

- Sistema completo de Autenticação (Login, Cadastro com hash bcrypt, JWT).
- Bibliotecas Privadas: Isolamento de dados no banco (cada usuário acessa e gerencia apenas seu próprio acervo).
- Cadastro, listagem, edição e exclusão de livros.
- Filtros rápidos por status na listagem:

	- `Todos`
	- `Lendo`
	- `Lidos`
	- `Quero ler`

- Contador de itens filtrados na listagem.
- Campos obrigatórios: título, autor, ano, era e gênero.
- Campos opcionais: descrição, nota, status de leitura, data de leitura, favorito.
- Destaque visual no card por faixa de nota e marcador de favorito.
- Interface responsiva com ajustes específicos para desktop e celular.
- Rodapé com link para o projeto no GitHub.

## Stack

- React 19
- Material UI
- Node.js
- Express
- Mongoose
- MongoDB Atlas

## Como rodar localmente

### 1. Backend

Na pasta `biblioteca-backend`:

```bash
npm install
npm start
```

Backend padrão configurado na porta `3001` (`http://localhost:3001`) quando `PORT` não é definida. Isso evita conflito com o servidor de desenvolvimento do React (porta `3000`).

Para ambiente de produção, `JWT_SECRET` é **obrigatório** — o backend NÃO INICIA em `NODE_ENV=production` sem esta variável.

### 2. Frontend

Na pasta `biblioteca-frontend`:

```bash
npm install
npm start
```

Frontend padrão rodando em `http://localhost:3000`.

### 3. Rodando ambos localmente (recomendado)

No root do repositório existe um script auxiliar para desenvolvimento que inicia backend e frontend em paralelo:

```bash
npm run dev
```

Este comando usa `concurrently` para abrir ambos os processos (backend em `3001`, frontend em `3000`).

### 4. Observações rápidas

- Se preferir, você pode iniciar manualmente cada app em terminais separados:

```bash
# Terminal 1 - Backend
cd biblioteca-backend
PORT=3001 npm start

# Terminal 2 - Frontend
cd biblioteca-frontend
npm start
```

- Antes de rodar em produção, configure `biblioteca-backend/.env` com as variáveis listadas em `docs/deploy.md`.
