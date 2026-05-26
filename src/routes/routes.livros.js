const express = require("express");
const router = express.Router();

const { sql, conectarBanco } = require("../config/database");



// PARA LISTAR TODOS OS LIVROS //

router.get("/", async (req, res) => {

  try {

    const pool = await conectarBanco();

    const resultado = await pool
      .request()
      .query("SELECT * FROM Livro");

    res.status(200).json(resultado.recordset);

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: erro.message
    });

  }

});



// PARA BUSCAR LIVRO POR ID //

router.get("/:id", async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const pool = await conectarBanco();

    const resultado = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Livro WHERE id_livro = @id");

    if (resultado.recordset.length === 0) {

      return res.status(404).json({
        erro: "Livro não encontrado!"
      });

    }

    res.status(200).json(resultado.recordset[0]);

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: erro.message
    });

  }

});



// PARA CRIAR LIVRO //

router.post("/", async (req, res) => {

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
        erro: "Todos os campos são obrigatórios!"
      });

    }

    const pool = await conectarBanco();

    await pool
      .request()
      .input("titulo", sql.VarChar, titulo)
      .input("ano", sql.Int, ano)
      .input("quantidade_estoque", sql.Int, quantidade_estoque)
      .input("id_categoria", sql.Int, id_categoria)
      .query(`
        INSERT INTO Livro
        (
          titulo,
          ano,
          quantidade_estoque,
          id_categoria
        )

        VALUES
        (
          @titulo,
          @ano,
          @quantidade_estoque,
          @id_categoria
        )
      `);

    res.status(201).json({
      mensagem: "Livro cadastrado com sucesso!"
    });

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: erro.message
    });

  }

});



// PARA ATUALIZAR LIVRO //

router.put("/:id", async (req, res) => {

  try {

    const id = parseInt(req.params.id);

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
        erro: "Todos os campos são obrigatórios!"
      });

    }

    const pool = await conectarBanco();

    const resultado = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Livro WHERE id_livro = @id");

    if (resultado.recordset.length === 0) {

      return res.status(404).json({
        erro: "Livro não encontrado!"
      });

    }

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("titulo", sql.VarChar, titulo)
      .input("ano", sql.Int, ano)
      .input("quantidade_estoque", sql.Int, quantidade_estoque)
      .input("id_categoria", sql.Int, id_categoria)
      .query(`
        UPDATE Livro

        SET
          titulo = @titulo,
          ano = @ano,
          quantidade_estoque = @quantidade_estoque,
          id_categoria = @id_categoria

        WHERE id_livro = @id
      `);

    res.status(200).json({
      mensagem: "Livro atualizado com sucesso!"
    });

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: erro.message
    });

  }

});



// PARA DELETAR LIVRO //

router.delete("/:id", async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const pool = await conectarBanco();

    const resultado = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Livro WHERE id_livro = @id");

    if (resultado.recordset.length === 0) {

      return res.status(404).json({
        erro: "Livro não encontrado!"
      });

    }

    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Livro WHERE id_livro = @id");

    res.status(200).json({
      mensagem: "Livro deletado com sucesso!"
    });

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: erro.message
    });

  }

});

module.exports = router;