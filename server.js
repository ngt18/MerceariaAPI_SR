const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');

app.use(express.json());

// Hello world básico
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
    try {
        const [result] = await db.query(
            "INSERT INTO produtos(nome, preco, quantidade, validade, categoria_id, fornecedor_id) VALUES (?, ?, ?, ?, ?, ?)",
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

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}/`);
});