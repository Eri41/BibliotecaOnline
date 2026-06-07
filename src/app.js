const express = require("express");
const path = require("path");

const livrosRoutes = require("./routes/routes.livros");
const authRoutes = require("./routes/routes.auth");

const app = express();
app.use(express.json());
app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

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