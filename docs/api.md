# Documentação da API

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
		"descricao": "Romance distopico sobre vigilancia e controle social",
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

### `PUT /livros/:id`

Edita um livro existente do usuário autenticado. Requer cabeçalho `Authorization: Bearer <token>`.
Aceita payload parcial (apenas os campos que deseja alterar).

### `DELETE /livros/:id`

Remove um livro do usuário autenticado pelo identificador. Requer cabeçalho `Authorization: Bearer <token>`.

## Regras de validacao (backend)

- `ano` deve ser inteiro e maior ou igual a `1`.
- `era` aceita apenas `AC` ou `DC`.
- `nota`, quando informada, deve estar entre `1` e `5` e seguir passo `0.5`.
- `statusLeitura`, quando informado, aceita apenas `QUERO_LER`, `LENDO` ou `LIDO`.

## Status Codes e Erros

- `200` — Sucesso para operações GET/PUT
- `201` — Recurso criado (POST /livros retorna `201`)
- `400` — Validação inválida (ex.: campo ausente ou formato inválido)
- `401` — Não autenticado (token ausente)
- `403` — Token inválido ou permissão insuficiente
- `404` — Recurso não encontrado (ex.: livro não pertence ao usuário)
- `503` — Serviço indisponível (ex.: banco de dados inacessível)

### Exemplos de resposta de erro

**POST /livros com nota inválida:**

```json
{
	"erro": "Nota deve ser menor ou igual a 5. Nota deve ser informada em incrementos de 0.5."
}
```

**PUT /livros/:id quando livro não pertence ao usuário:**

```json
{
	"erro": "Livro nao encontrado ou sem permissao."
}
```

**Banco de dados indisponível (ex.: MONGO desconectado):**

```json
{
	"erro": "Banco de dados indisponivel no momento. Tente novamente em instantes."
}
```

## Observacoes

- Em producao, sempre definir `CORS_ORIGIN` para restringir origem permitida.
