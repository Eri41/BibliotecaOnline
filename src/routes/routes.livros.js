const express = require("express");
const router = express.Router();

const pool = require("../config/database");
const autenticarToken = require("../middleware/auth");



// PARA LISTAR TODOS OS LIVROS //

router.get("/", autenticarToken, async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT
                l.id_livro,
                l.titulo,
                l.ano,
                l.quantidade_estoque,
                l.id_categoria,
                c.nome AS categoria
            FROM livro l
            LEFT JOIN categoria c
                ON l.id_categoria = c.id_categoria
            ORDER BY l.id_livro
        `);

        res.status(200).json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});



// PARA BUSCAR LIVRO POR ID //

router.get("/:id", autenticarToken, async (req, res) => {

    try {

        const resultado = await pool.query(

            `
            SELECT
                l.id_livro,
                l.titulo,
                l.ano,
                l.quantidade_estoque,
                l.id_categoria,
                c.nome AS categoria
            FROM livro l
            LEFT JOIN categoria c
                ON l.id_categoria = c.id_categoria
            WHERE l.id_livro = $1
            `,

            [req.params.id]

        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: "Livro não encontrado"
            });

        }

        res.status(200).json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});



// PARA CADASTRAR LIVRO //

router.post("/", autenticarToken, async (req, res) => {

    try {

        const {
            titulo,
            ano,
            quantidade_estoque,
            id_categoria
        } = req.body;

        if (
            !titulo ||
            !ano ||
            quantidade_estoque == null ||
            !id_categoria
        ) {

            return res.status(400).json({
                erro: "Todos os campos são obrigatórios"
            });

        }

        const resultado = await pool.query(

            `
            INSERT INTO livro
            (
                titulo,
                ano,
                quantidade_estoque,
                id_categoria
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING *
            `,

            [
                titulo,
                ano,
                quantidade_estoque,
                id_categoria
            ]

        );

        res.status(201).json({
            mensagem: "Livro cadastrado com sucesso",
            livro: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});



// PARA ATUALIZAR LIVRO //

router.put("/:id", autenticarToken, async (req, res) => {

    try {

        const {
            titulo,
            ano,
            quantidade_estoque,
            id_categoria
        } = req.body;

        const existe = await pool.query(

            `
            SELECT *
            FROM livro
            WHERE id_livro = $1
            `,

            [req.params.id]

        );

        if (existe.rows.length === 0) {

            return res.status(404).json({
                erro: "Livro não encontrado"
            });

        }

        const resultado = await pool.query(

            `
            UPDATE livro
            SET
                titulo = $1,
                ano = $2,
                quantidade_estoque = $3,
                id_categoria = $4
            WHERE id_livro = $5
            RETURNING *
            `,

            [
                titulo,
                ano,
                quantidade_estoque,
                id_categoria,
                req.params.id
            ]

        );

        res.status(200).json({
            mensagem: "Livro atualizado com sucesso",
            livro: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});



// PARA DELETAR LIVRO //

router.delete("/:id", autenticarToken, async (req, res) => {

    try {

        const existe = await pool.query(

            `
            SELECT *
            FROM livro
            WHERE id_livro = $1
            `,

            [req.params.id]

        );

        if (existe.rows.length === 0) {

            return res.status(404).json({
                erro: "Livro não encontrado"
            });

        }

        await pool.query(

            `
            DELETE FROM livro
            WHERE id_livro = $1
            `,

            [req.params.id]

        );

        res.status(200).json({
            mensagem: "Livro removido com sucesso"
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

module.exports = router;