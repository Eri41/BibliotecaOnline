// A ROTA DE AUTENTICAÇÃO TAMBÉM FOI CRIADA DE FORMA SEPARADA, PARA MANTER A ORGANIZAÇÃO DO PROJETO //
// ROTA DE CADASTRO DE USUÁRIO //
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const { sql, conectarBanco } = require("../config/database");

router.post("/register", async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        const pool = await conectarBanco();

        await pool.request()
            .input("nome", sql.VarChar, nome)
            .input("email", sql.VarChar, email)
            .input("senha", sql.VarChar, senhaHash)
            .query(`
                INSERT INTO Usuario
                (nome,email,senha)
                VALUES
                (@nome,@email,@senha)
            `);

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso"
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

// RODA DE LOGIN //

router.post("/login", async (req, res) => {

    try {

        const { email, senha } = req.body;

        const pool = await conectarBanco();

        const resultado = await pool.request()
            .input("email", sql.VarChar, email)
            .query(`
                SELECT *
                FROM Usuario
                WHERE email = @email
            `);

        const usuario = resultado.recordset[0];

        if (!usuario) {

            return res.status(401).json({
                erro: "Usuário não encontrado"
            });

        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {

            return res.status(401).json({
                erro: "Senha inválida"
            });

        }

        const token = jwt.sign(

            {
                id: usuario.id_usuario,
                email: usuario.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1h"
            }

        );

        res.json({
            token
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

module.exports = router;