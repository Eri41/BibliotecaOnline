const express = require("express");
const livrosRoutes = require("./routes/routes.livros");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Biblioteca Online funcionando!");
});

app.use("/livros", livrosRoutes);

module.exports = app;

