const express = require("express");

const livrosRoutes = require("./routes/routes.livros");
const authRoutes = require("./routes/routes.auth");

const app = express();

// MIDLEWARE PRA RECEBER JSON //
app.use(express.json());

// RROTA INICIAL //
app.get("/", (req, res) => {
    res.json({
        mensagem: "API Biblioteca Online funcionando!"
    });
});

// ROTA DE AUTENTICAÇÃO //  
app.use("/auth", authRoutes);

// RoOTA DE LIVROS // 
app.use("/livros", livrosRoutes);

module.exports = app;