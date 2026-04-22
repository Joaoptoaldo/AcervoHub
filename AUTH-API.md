# API de Autenticação – AcervoHub

Este documento descreve as rotas de autenticação do backend do AcervoHub, exemplos de uso e payloads esperados.

---

## Cadastro de Usuário
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

## Login
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

## Ativar 2FA
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

## Confirmar 2FA
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

## Desativar 2FA
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

## Promover usuário a admin
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

## Observações
- Para rotas protegidas (ex: criar, editar, deletar livros), envie o header:
  Authorization: Bearer JWT_AQUI
- Apenas usuários com role 'admin' podem deletar livros.
- O JWT é válido por 2 horas.

