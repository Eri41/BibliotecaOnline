const sql = require("mssql/msnodesqlv8");

const config = {
  server: "DESKTOP-KDEJ5L8\\SQL2019",
  database: "LibAcad",

  options: {
    trustedConnection: true,
    trustServerCertificate: true
  },

  driver: "msnodesqlv8"
};

async function conectarBanco() {

  try {

    const pool = await sql.connect(config);

    console.log("Conectado ao banco com autenticação Windows!"); // Foi deixada autenticação por windows pois ao configurar pelo SQL usando o usuário sa e a senha do banco, por algum motivo a API conectava mas não conseguia buscas os livros, mesmo o banco estava confiurado para isso. Enfim, por autenticação do Windows funcionou normlmente. //

    return pool;

  } catch (erro) {

    console.error("Falha na conexão:", erro);

  }

}

module.exports = {
  sql,
  conectarBanco
};