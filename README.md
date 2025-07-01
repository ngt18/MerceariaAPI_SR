## Instalação e Execução

Esta aplicação foi desenvolvida utilizando Node.js com o framework Express e se conecta a um banco de dados MySQL chamado `MerceariaAPI`.

O projeto está organizado para disponibilizar uma API RESTful, que permite a gestão de produtos, categorias, fornecedores e movimentações de estoque de uma mercearia.

A conexão com o banco de dados é feita via pool de conexões usando o pacote `mysql2/promise`. Toda a estrutura do banco já está criada e contém as seguintes tabelas:

- `categoria`: define os tipos de produtos existentes.
- `fornecedor`: armazena os dados dos fornecedores.
- `produto`: representa os produtos cadastrados, com vínculo à categoria e fornecedor.
- `movimentacoes_estoque`: registra entradas e saídas de produtos no estoque, com atualização automática da quantidade.

As requisições são feitas no formato JSON e os endpoints seguem os padrões HTTP (GET, POST, PUT, DELETE).

---

## Endpoints

### Categorias

- `GET /categoria` - Lista todas as categorias cadastradas.
- `GET /categoria/:id` - Exibe os dados de uma categoria específica.
- `POST /categoria` - Cadastra uma nova categoria.
- `PUT /categoria/:id` - Atualiza uma categoria existente.
- `DELETE /categoria/:id` - Remove uma categoria pelo ID.

### Fornecedores

- `GET /fornecedor` - Lista todos os fornecedores cadastrados.
- `GET /fornecedor/:id` - Exibe os dados de um fornecedor específico.
- `POST /fornecedor` - Cadastra um novo fornecedor.
- `PUT /fornecedor/:id` - Atualiza os dados de um fornecedor.
- `DELETE /fornecedor/:id` - Remove um fornecedor pelo ID.

### Produtos

- `GET /produto` - Lista todos os produtos disponíveis.
- `GET /produto/:id` - Exibe os dados de um produto específico.
- `POST /produto` - Cadastra um novo produto.
- `PUT /produto/:id` - Atualiza os dados de um produto existente.
- `DELETE /produto/:id` - Remove um produto pelo ID.

### Movimentações de Estoque

- `GET /movimentacoes` - Lista todas as movimentações realizadas (entradas e saídas).
- `GET /movimentacoes/:id` - Exibe os dados de uma movimentação específica.
- `POST /movimentacoes` - Registra uma nova movimentação no estoque (tipo `entrada` ou `saida`).
- `PUT /movimentacoes/:id` - Atualiza os dados de uma movimentação existente.
- `DELETE /movimentacoes/:id` - Remove uma movimentação pelo ID.
---

## Exemplos de Uso

### POST /categoria
```json
{
  "nome": "Alimento"
}
```
### POST /fornecedor
```json
{
  "nome": "SEARA",
  "telefone": "(47) 3801-6000.",
  "email": "suporte@seara.com.br"
}
```

### POST /produto

```json
{
  "nome": "Frango",
  "preco": 18.90,
  "quantidade": 17,
  "validade":"2025-11-05",
  "categoria_id":, /// usar o ID gerado pela categoria criada
  "fornecedor_id": /// usar o ID gerado pelo fornecedor criado 
}
```