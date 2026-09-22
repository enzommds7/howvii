// ---------------------------------------------------------------------------
// Camada de conexao com o banco de dados MySQL 8.0 (driver mysql2/promise).
//
// A conexao e gerenciada por um pool: as conexoes sao reutilizadas entre as
// requisicoes HTTP, evitando o custo de abrir e encerrar uma conexao a cada
// chamada de servico.
//
// As credenciais sao lidas do arquivo .env (nao versionado), mantendo dados
// sensiveis fora do codigo-fonte.
// ---------------------------------------------------------------------------
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "imobiliaria",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Colunas DATE sao retornadas como texto "AAAA-MM-DD", e nao como objeto
  // Date do JavaScript. Isso evita a conversao de fuso horario que poderia
  // deslocar um pagamento do dia 1o para o mes anterior no agrupamento por
  // mes/ano exigido pela Parte 2.
  dateStrings: true,

  // Colunas DECIMAL sao retornadas como Number, e nao como String. Sem esta
  // opcao, o operador "+" concatenaria os valores em vez de soma-los nas
  // funcoes de agregacao com reduce da Parte 2.
  decimalNumbers: true,
});

/**
 * Verifica se a aplicacao consegue se comunicar com o servidor MySQL.
 * Utilizada na inicializacao do servidor para diagnosticar problemas de
 * configuracao (.env) ou de servico do banco antes do atendimento das rotas.
 */
async function testarConexao() {
  const conexao = await pool.getConnection();
  try {
    await conexao.query("SELECT 1");
    console.log("[db] Conexao com o MySQL estabelecida.");
  } finally {
    conexao.release();
  }
}

module.exports = { pool, testarConexao };
