# Documentação de Autenticação

Este documento descreve as rotas de autenticação do backend do AcervoHub, exemplos de uso e payloads esperados.

---

### Cadastro de Usuário
**POST /auth/cadastro**

Body (JSON):
```json
{
  "nome": "João Pedro",
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```
Resposta:
- 201: `{ "mensagem": "Usuário cadastrado com sucesso." }`
- 409: `{ "erro": "E-mail já cadastrado." }`

---

### Login
**POST /auth/login**

Body (JSON):
```json
{
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```
Se 2FA estiver ativado, inclua:
```json
{
  "codigo2fa": "123456"
}
```
Resposta:
- 200: `{ "token": "JWT_AQUI", "usuario": { ... } }`
- 401: `{ "erro": "Credenciais inválidas." }`

**Observação sobre expiração de token:**
- Os tokens JWT emitidos pela API expiram em **2 horas** (`expiresIn: '2h'`). Atualmente não há um endpoint de refresh token; após expiração o usuário deverá autenticar novamente.

---

### Ativar 2FA
**POST /auth/ativar-2fa**

Body (JSON):
```json
{
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```
Resposta:
- 200: `{ "secret": "BASE32SECRET", "otpauth_url": "otpauth://..." }`

---

### Confirmar 2FA
**POST /auth/confirmar-2fa**

Body (JSON):
```json
{
  "email": "joao@email.com",
  "senha": "senhaSegura123",
  "codigo2fa": "123456"
}
```
Resposta:
- 200: `{ "mensagem": "2FA ativado com sucesso." }`

---

### Desativar 2FA
**POST /auth/desativar-2fa**

Body (JSON):
```json
{
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}
```
Resposta:
- 200: `{ "mensagem": "2FA desativado." }`

---

### Promover usuário a admin
**PATCH /auth/promover-admin**

- Apenas um admin autenticado pode acessar esta rota.
- Envie o token JWT de admin no header Authorization.

Body (JSON):
```json
{
  "email": "usuario@email.com"
}
```
Resposta:
- 200: `{ "mensagem": "Usuário usuario@email.com promovido a admin com sucesso." }`
- 404: `{ "erro": "Usuário não encontrado." }`
- 403: `{ "erro": "Acesso negado: permissão insuficiente." }`

---

### Retornar Usuário Atual
**GET /auth/me**

- Rota protegida. Envie o token JWT no header Authorization.

Resposta:
- 200: `{ "id": "...", "nome": "...", "email": "...", "role": "usuario" }`
- 404: `{ "erro": "Usuário não encontrado." }`

---

### Observações de Autenticação

- Para rotas protegidas (ex: criar, editar, deletar livros), envie o header:
  `Authorization: Bearer JWT_AQUI`
- Qualquer usuário autenticado tem permissão para criar, editar e excluir os SEUS próprios livros.
- Em produção, `JWT_SECRET` deve estar configurado no backend. Sem essa variável, o servidor não inicia.

- Os endpoints de 2FA (`/ativar-2fa`, `/confirmar-2fa`, `/desativar-2fa`) estão implementados apenas na API; as telas correspondentes no frontend ainda não foram entregues.

### Status no Frontend

- Atualmente, a interface web cobre login/cadastro e o fluxo de livros.
- Os fluxos de ativação/confirmação/desativação de 2FA e promoção de usuário para admin já existem na API, mas ainda não possuem telas no frontend.
- Essas funcionalidades de UI serão implementadas posteriormente.
