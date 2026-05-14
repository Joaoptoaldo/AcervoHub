# Deploy e Variáveis de Ambiente

## Variáveis de ambiente (essenciais)

### Backend

- `MONGODB_URI`: string de conexão do MongoDB Atlas.
- `CORS_ORIGIN`: origem permitida no CORS (URL do frontend publicado). Exemplo: `https://seu-app.vercel.app` (sem barra final).
- `PORT`: porta da API (default local `3001`).
- `JWT_SECRET`: segredo usado para assinar e validar JWT.
	- ⚠️ OBRIGATÓRIO em produção: quando `NODE_ENV=production` o backend **não inicia** se `JWT_SECRET` não estiver definido. Se faltar, o processo lança erro e encerra a inicialização.

### Frontend

- `REACT_APP_API_URL`: URL da API (ex: `https://seu-backend.onrender.com`).
	- Em Vercel: adicione esta variável em *Project Settings → Environment Variables* (Build & Production). Use a URL pública do backend (sem barra final).
	- Fallback local usado pelo frontend: `http://localhost:3001` (quando não configurado).

## Deploy

### Frontend no Vercel

1. Criar projeto apontando para `biblioteca-frontend`.
2. Em *Project Settings → Environment Variables* adicione:

```
REACT_APP_API_URL = https://seu-backend.onrender.com
```

3. Build command: `npm run build`.
4. Output directory: `build`.

**Verificação:** após o deploy, abra DevTools → Network e confirme que as requisições apontam para a URL configurada.

### Backend no Render (ou outro provider)

1. Publicar o backend como Web Service usando `biblioteca-backend`.
2. Configure as variáveis `MONGODB_URI`, `CORS_ORIGIN` e `JWT_SECRET` no painel do provedor.
3. Build command: `npm install`.
4. Start command: `npm start`.

## Observações importantes

- O backend não gera pasta `build` (executa diretamente com Node.js).
- ⚠️ **JWT_SECRET**: Gere um segredo forte (ex: 32+ caracteres aleatórios). Em caso de falta, o backend encerrará a inicialização em produção.
- `CORS_ORIGIN` deve conter a origem exata do frontend; para múltiplas origens, configure regras no provedor ou utilize lógica personalizada no backend.
- Recomenda-se criar `biblioteca-backend/.env.example` com as variáveis mínimas para desenvolvimento (veja `.env.example` no repositório).
