const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');

app.use(express.json());


app.get("/", (req, res) => {
    res.send("API MerceariaSR funcionando!");
});

// Listar todos os produtos
app.get("/produto", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM produto");
        res.json(rows);
    } catch (error) {
        console.log("Erro ao buscar produtos: " + error.message);
        res.status(500).send("Erro ao buscar produtos");
    }
});

// Buscar produto pelo id
app.get("/produto/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query("SELECT * FROM produto WHERE id = ?", [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send("Produto com id: " + id + " não encontrado!");
        }
    } catch (error) {
        console.log("Erro ao buscar produto: " + error.message);
        res.status(500).send("Erro ao buscar produto");
    }
});

// Criar produto
app.post("/produto", async (req, res) => {
    let produto = req.body;

    if (!produto.nome || produto.preco == null || produto.quantidade == null) {
        return res.status(400).send("Campos obrigatórios: nome, preco, quantidade");
    }
    if (produto.preco < 0 || produto.quantidade < 0) {
        return res.status(400).send("Preço e quantidade devem ser valores positivos.");
    }

    try {
        const [result] = await db.query(
            "INSERT INTO produto(nome, preco, quantidade, validade, categoria_id, fornecedor_id) VALUES (?, ?, ?, ?, ?, ?)",
            [produto.nome, produto.preco, produto.quantidade, produto.validade, produto.categoria_id, produto.fornecedor_id]
        );
        produto.id = result.insertId;
        res.status(201).json(produto);
    } catch (error) {
        console.log("Erro ao cadastrar produto: " + error.message);
        res.status(500).send("Erro ao cadastrar produto");
    }
});

// Atualizar produto
app.put("/produto/:id", async (req, res) => {
    const id = req.params.id;
    let produto = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM produto WHERE id = ?", [id]);
        if (rows.length > 0) {
            await db.query(
                "UPDATE produto SET nome = ?, preco = ?, quantidade = ?, validade = ?, categoria_id = ?, fornecedor_id = ? WHERE id = ?",
                [produto.nome, produto.preco, produto.quantidade, produto.validade, produto.categoria_id, produto.fornecedor_id, id]
                
            );
            produto.id = Number(id);
            res.status(200).json(produto);
        } else {
            res.status(404).send("Produto com id: " + id + " não encontrado!");
        }
    } catch (error) {
        console.log("Erro ao atualizar produto: " + error.message);
        res.status(500).send("Erro ao atualizar produto");
    }
});

// Deletar produto
app.delete("/produto/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.query("DELETE FROM produto WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.status(204).send("Produto deletado com sucesso!");
        } else {
            res.status(404).send("Produto não encontrado para deletar!");
        }
    } catch (error) {
        console.log("Erro ao deletar produto: " + error.message);
        res.status(500).send("Erro ao deletar produto");
    }
});

// Listar todas as categorias
app.get("/categoria", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categorias");
        res.json(rows);
    } catch (error) {
        console.log("Erro ao buscar categorias:", error.message);
        res.status(500).send("Erro ao buscar categorias");
    }
});

// Buscar categoria por ID
app.get("/categoria/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query("SELECT * FROM categorias WHERE id = ?", [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send("Categoria não encontrada!");
        }
    } catch (error) {
        console.log("Erro ao buscar categoria:", error.message);
        res.status(500).send("Erro ao buscar categoria");
    }
});

// Criar nova categoria
app.post("/categoria", async (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).send("O campo 'nome' é obrigatório.");
    try {
        const [result] = await db.query("INSERT INTO categorias (nome) VALUES (?)", [nome]);
        res.status(201).json({ id: result.insertId, nome });
    } catch (error) {
        console.log("Erro ao cadastrar categoria:", error.message);
        res.status(500).send("Erro ao cadastrar categoria");
    }
});

// Atualizar categoria
app.put("/categoria/:id", async (req, res) => {
    const id = req.params.id;
    const { nome } = req.body;
    if (!nome) return res.status(400).send("O campo 'nome' é obrigatório.");

    try {
        const [rows] = await db.query("SELECT * FROM categorias WHERE id = ?", [id]);
        if (rows.length > 0) {
            await db.query("UPDATE categorias SET nome = ? WHERE id = ?", [nome, id]);
            res.json({ id: Number(id), nome });
        } else {
            res.status(404).send("Categoria não encontrada!");
        }
    } catch (error) {
        console.log("Erro ao atualizar categoria:", error.message);
        res.status(500).send("Erro ao atualizar categoria");
    }
});

// Deletar categoria
app.delete("/categoria/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.query("DELETE FROM categorias WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.status(204).send(); // Deletado com sucesso, sem conteúdo
        } else {
            res.status(404).send("Categoria não encontrada para deletar.");
        }
    } catch (error) {
        console.log("Erro ao deletar categoria:", error.message);
        res.status(500).send("Erro ao deletar categoria");
    }
});

// Listar todos os fornecedores
app.get("/fornecedor", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM fornecedores");
        res.json(rows);
    } catch (error) {
        console.log("Erro ao buscar fornecedores:", error.message);
        res.status(500).send("Erro ao buscar fornecedores");
    }
});

// Buscar fornecedor por ID
app.get("/fornecedor/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query("SELECT * FROM fornecedores WHERE id = ?", [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send("Fornecedor não encontrado!");
        }
    } catch (error) {
        console.log("Erro ao buscar fornecedor:", error.message);
        res.status(500).send("Erro ao buscar fornecedor");
    }
});

// Criar fornecedor
app.post("/fornecedor", async (req, res) => {
    const { nome, telefone, email } = req.body;
    if (!nome) return res.status(400).send("O campo 'nome' é obrigatório.");
    try {
        const [result] = await db.query(
            "INSERT INTO fornecedores (nome, telefone, email) VALUES (?, ?, ?)",
            [nome, telefone, email]
        );
        res.status(201).json({ id: result.insertId, nome, telefone, email });
    } catch (error) {
        console.log("Erro ao cadastrar fornecedor:", error.message);
        res.status(500).send("Erro ao cadastrar fornecedor");
    }
});

// Atualizar fornecedor
app.put("/fornecedor/:id", async (req, res) => {
    const id = req.params.id;
    const { nome, telefone, email } = req.body;
    if (!nome) return res.status(400).send("O campo 'nome' é obrigatório.");

    try {
        const [rows] = await db.query("SELECT * FROM fornecedores WHERE id = ?", [id]);
        if (rows.length > 0) {
            await db.query(
                "UPDATE fornecedores SET nome = ?, telefone = ?, email = ? WHERE id = ?",
                [nome, telefone, email, id]
            );
            res.json({ id: Number(id), nome, telefone, email });
        } else {
            res.status(404).send("Fornecedor não encontrado!");
        }
    } catch (error) {
        console.log("Erro ao atualizar fornecedor:", error.message);
        res.status(500).send("Erro ao atualizar fornecedor");
    }
});

// Deletar fornecedor
app.delete("/fornecedor/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.query("DELETE FROM fornecedores WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.status(204).send()
        } else {
            res.status(404).send("Fornecedor não encontrado para deletar.");
        }
    } catch (error) {
        console.log("Erro ao deletar fornecedor:", error.message);
        res.status(500).send("Erro ao deletar fornecedor");
    }
});

// Listar todas as movimentações
app.get("/movimentacoes", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM movimentacoes_estoque");
        res.json(rows);
    } catch (error) {
        console.log("Erro ao buscar movimentações:", error.message);
        res.status(500).send("Erro ao buscar movimentações");
    }
});

// Buscar movimentação por ID
app.get("/movimentacoes/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query("SELECT * FROM movimentacoes_estoque WHERE id = ?", [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send("Movimentação não encontrada!");
        }
    } catch (error) {
        console.log("Erro ao buscar movimentação:", error.message);
        res.status(500).send("Erro ao buscar movimentação");
    }
});

// Criar movimentação
app.post("/movimentacoes", async (req, res) => {
    const { produto_id, tipo, quantidade, descricao } = req.body;
    if (!produto_id || !tipo || !quantidade) {
        return res.status(400).send("Campos obrigatórios: produto_id, tipo, quantidade");
    }
        if (!['entrada', 'saida'].includes(tipo)) {
        return res.status(400).send("Tipo deve ser 'entrada' ou 'saida'.");
    }
    if (quantidade <= 0) {
        return res.status(400).send("A quantidade deve ser maior que zero.");
    }
    try {
        const [result] = await db.query(
            "INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, descricao) VALUES (?, ?, ?, ?)",
            [produto_id, tipo, quantidade, descricao]
        );
        res.status(201).json({ id: result.insertId, produto_id, tipo, quantidade, descricao });
    } catch (error) {
        console.log("Erro ao cadastrar movimentação:", error.message);
        res.status(500).send("Erro ao cadastrar movimentação");
    }
});

// Atualizar movimentação
app.put("/movimentacoes/:id", async (req, res) => {
    const id = req.params.id;
    const { produto_id, tipo, quantidade} = req.body;
    if (!produto_id || !tipo || !quantidade) {
        return res.status(400).send("Campos obrigatórios: produto_id, tipo, quantidade");
    }

    try {
        const [rows] = await db.query("SELECT * FROM movimentacoes_estoque WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Movimentação não encontrada");
        }

        await db.query(
            "UPDATE movimentacoes_estoque SET produto_id = ?, tipo = ?, quantidade = ?, descricao = ? WHERE id = ?",
            [produto_id, tipo, quantidade, descricao, id]
        );
        res.status(200).json({ id: Number(id), produto_id, tipo, quantidade, descricao });
    } catch (error) {
        console.log("Erro ao atualizar movimentação:", error.message);
        res.status(500).send("Erro ao atualizar movimentação");
    }
});

// Deletar movimentação
app.delete("/movimentacoes/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.query("DELETE FROM movimentacoes_estoque WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).send("Movimentação não encontrada para deletar.");
        }
    } catch (error) {
        console.log("Erro ao deletar movimentação:", error.message);
        res.status(500).send("Erro ao deletar movimentação");
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}/`);
});