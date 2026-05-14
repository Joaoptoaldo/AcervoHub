# Testes

Este documento descreve como executar os testes básicos do projeto.

## Backend (unit tests com Jest)

1. Acesse a pasta do backend:

```bash
cd biblioteca-backend
```

2. Instale as dependências (caso necessário):

```bash
npm install
```

3. Execute os testes:

```bash
npm test
```

Os testes básicos usam `jest` e incluem checagens unitárias simples (ex.: `jwt.config`). Eles não iniciam o servidor HTTP nem dependem do MongoDB.

## Frontend

O frontend usa o teste padrão do Create React App:

```bash
cd biblioteca-frontend
npm test
```

## Testando com Docker Compose

Se preferir, você pode usar `docker-compose` para levantar serviços e executar testes em um ambiente isolado. Veja `docker-compose.yml` na raiz do repositório.
