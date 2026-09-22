// ---------------------------------------------------------------------------
// Servidor de aplicacao (Node.js + Express) - Hands on Work VII.
//
// Expoe os servicos web (HTTP/REST) responsaveis por fornecer os dados de
// pagamentos de imoveis a aplicacao cliente. Nesta Entrega 1 esta implementada
// a rota do item (e) da Parte 1, que executa a consulta com JOIN e devolve o
// resultado bruto em JSON.
//
// O documento OpenAPI do item (f) e publicado em /api-docs pela interface do
// Swagger UI, permitindo o teste interativo das chamadas exigido pelo item (d)
// da Parte 2.
// ---------------------------------------------------------------------------
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { pool, testarConexao } = require("./db");
const { pagamentoRepository } = require("./pagamentosRepository");

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI servindo a especificacao OpenAPI do item (f).
const especificacao = YAML.load(path.join(__dirname, "..", "docs", "openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(especificacao));

// Rota de verificacao de disponibilidade do servico.
app.get("/", (req, res) => {
  res.json({ status: "ok", mensagem: "API Hands on Work VII em execucao." });
});

// Rota de diagnostico do ambiente: confirma a comunicacao com o MySQL sem
// depender de nenhuma tabela do modelo.
app.get("/api/teste-banco", async (req, res) => {
  try {
    const [linhas] = await pool.query("SELECT NOW() AS agora");
    res.json({ conectado: true, horaServidorMySQL: linhas[0].agora });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ conectado: false, erro: erro.message });
  }
});

// Item (e) da Parte 1: executa a consulta com JOIN do item (d) e devolve o
// resultado integral, sem filtros nem agregacoes, em formato JSON.
app.get("/api/pagamentos-completo", async (req, res) => {
  try {
    const pagamentos = await pagamentoRepository.buscarTodos();
    res.json(pagamentos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao consultar o banco de dados." });
  }
});

// ---------------------------------------------------------------------------
// Parte 2 (Entrega 2): as tres rotas de agregacao especificadas no documento
// OpenAPI (docs/openapi.yaml) serao registradas aqui. Todas consumirao
// pagamentoRepository.buscarTodos() e processarao a lista resultante em
// JavaScript com map/filter/reduce/forEach, sem WHERE nem GROUP BY no SQL.
// GET /api/pagamentos-por-imovel -> grafico "a" (barras)
// GET /api/vendas-por-mes        -> grafico "b" (linhas/dispersao)
// GET /api/percentual-por-tipo   -> grafico "c" (pizza)
// ---------------------------------------------------------------------------

app.get("/api/pagamentos-por-imovel", async (req, res) => {
  try {
    const pagamentos = await pagamentoRepository.buscarTodos();
    
    // reduce para agrupar e somar pagamentos por codigo_imovel
    const somaPorImovel = pagamentos.reduce((acc, pagamento) => {
      const codigo = pagamento.codigo_imovel;
      acc[codigo] = (acc[codigo] || 0) + pagamento.valor_do_pagamento;
      return acc;
    }, {});

    // map para transformar o objeto em array
    const resultado = Object.keys(somaPorImovel).map((codigo) => {
      return {
        codigo_imovel: Number(codigo),
        total_pagamentos: somaPorImovel[codigo]
      };
    });

    res.json(resultado);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao processar a rota /api/pagamentos-por-imovel" });
  }
});

app.get("/api/vendas-por-mes", async (req, res) => {
  try {
    const pagamentos = await pagamentoRepository.buscarTodos();
    
    // reduce para agrupar e somar pagamentos por mes/ano
    const somaPorMes = pagamentos.reduce((acc, pagamento) => {
      const mes = pagamento.mesAno;
      acc[mes] = (acc[mes] || 0) + pagamento.valor_do_pagamento;
      return acc;
    }, {});

    // map para formatar a resposta
    const resultado = Object.keys(somaPorMes).map((mes) => {
      return {
        mes_ano: mes,
        total_vendas: somaPorMes[mes]
      };
    });

    res.json(resultado);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao processar a rota /api/vendas-por-mes" });
  }
});

app.get("/api/percentual-por-tipo", async (req, res) => {
  try {
    const pagamentos = await pagamentoRepository.buscarTodos();
    
    // reduce para encontrar o valor total de todas as vendas
    const totalVendasGeral = pagamentos.reduce((total, p) => total + p.valor_do_pagamento, 0);

    // reduce para agrupar o valor total por tipo_imovel
    const somaPorTipo = pagamentos.reduce((acc, pagamento) => {
      const tipo = pagamento.tipo_imovel;
      acc[tipo] = (acc[tipo] || 0) + pagamento.valor_do_pagamento;
      return acc;
    }, {});

    // map para calcular o percentual e formatar a resposta
    const resultado = Object.keys(somaPorTipo).map((tipo) => {
      const totalDoTipo = somaPorTipo[tipo];
      const percentual = Number(((totalDoTipo / totalVendasGeral) * 100).toFixed(2));
      return {
        tipo_imovel: tipo,
        percentual: percentual
      };
    });

    res.json(resultado);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao processar a rota /api/percentual-por-tipo" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`[server] Servidor em execucao em http://localhost:${PORT}`);
  console.log(`[server] Documentacao Swagger em http://localhost:${PORT}/api-docs`);
  try {
    await testarConexao();
  } catch (erro) {
    console.warn(
      "[server] Nao foi possivel conectar ao MySQL. Verifique o arquivo .env " +
      "e se o servico do banco de dados esta ativo. Detalhe:",
      erro.message
    );
  }
});
