# Arquitetura e Modelo de Dados

O projeto está dividido em dois apps principais, permitindo uma separação clara de responsabilidades entre backend e frontend.

- `biblioteca-backend`: API REST com Express + Mongoose.
- `biblioteca-frontend`: interface React com Material UI.

## Interação entre o Frontend e Backend

O frontend se comunica com o backend através de requisições HTTP e JWT para autenticação e autorização. Todo o acervo é privado, ou seja, cada usuário tem acesso apenas ao seu próprio acervo, configurando o modelo de dados com vínculo de `usuario` em cada livro salvo.

## Modelo de dados

Cada usuario cadastrado na aplicação contém:

- `_id` (identificador unico do usuario, gerado automaticamente)
- `nome` (obrigatório)
- `email` (obrigatório, unico)
- `senha` (obrigatório, hash em bcrypt)
- `role` (obrigatório, default `usuario`)
- `twoFA` (objeto com `ativado` boolean e `secret` string)
- `verificado` (opcional, default `false`)
- `criadoEm` (automático)

Cada livro pode conter:

- `_id` (identificador unico do livro, gerado automaticamente)
- `usuario` (identificador unico do usuario, gerado automaticamente)
- `titulo` (obrigatório)
- `autor` (obrigatório)
- `ano` (obrigatório, inteiro >= 1)
- `era` (obrigatório, `AC` ou `DC`)
- `genero` (obrigatório)
- `descricao` (opcional)
- `nota` (opcional, número entre 1 e 5 em incrementos de 0.5)
- `statusLeitura` (opcional, default `QUERO_LER`)
- `dataLeitura` (opcional)
- `favorito` (opcional, default `false`)
- `dataCadastro` (automático)

A persistência de dados é feita via MongoDB Atlas, com as validações de schema e isolamento por usuário sendo gerenciados no Mongoose (Backend).

## Autenticação e Segurança

A aplicação utiliza autenticação baseada em JWT (JSON Web Tokens). As senhas são submetidas a hash via `bcrypt` antes de serem salvas no MongoDB. O sistema garante que cada usuário tenha acesso apenas ao seu próprio acervo, configurando o modelo de dados com vínculo de `usuario` em cada livro salvo.

Além disso, a plataforma suporta **Autenticação em Duas Etapas (2FA)** utilizando o padrão TOTP (Time-Based One-Time Password) implementado com a biblioteca `speakeasy`, proporcionando uma camada extra de segurança para contas de usuários.
