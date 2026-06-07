const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const pool = require("../config/database");



// PARA CADASTRO DE USUÁRIO //

router.post("/register", async (req, res) => {

    try {

        const {
            nome,
            email,
            senha
        } = req.body;

        if (!nome || !email || !senha) {

            return res.status(400).json({
                erro: "Todos os campos são obrigatórios"
            });

        }

        const usuarioExistente = await pool.query(

            `
            SELECT *
            FROM usuario
            WHERE email = $1
            `,

            [email]

        );

        if (usuarioExistente.rows.length > 0) {

            return res.status(409).json({
                erro: "Email já cadastrado"
            });

        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(

            `
            INSERT INTO usuario
            (
                nome,
                email,
                senha
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            RETURNING
                id_usuario,
                nome,
                email
            `,

            [
                nome,
                email,
                senhaHash
            ]

        );

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso",
            usuario: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});



// PARA LOGIN //

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            senha
        } = req.body;

        if (!email || !senha) {

            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });

        }

        const resultado = await pool.query(

            `
            SELECT *
            FROM usuario
            WHERE email = $1
            `,

            [email]

        );

        if (resultado.rows.length === 0) {

            return res.status(401).json({
                erro: "Usuário não encontrado"
            });

        }

        const usuario = resultado.rows[0];

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
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1h"
            }

        );

        res.status(200).json({

            mensagem: "Login realizado com sucesso",

            token,

            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            }

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

module.exports = router;