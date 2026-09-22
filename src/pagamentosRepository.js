// ---------------------------------------------------------------------------
// Repositorio de pagamentos (paradigma orientado a objetos).
//
// Concentra o unico acesso ao banco de dados da aplicacao: a consulta com
// JOIN entre pagamento, imovel e tipo_imovel definida no item (d) da Parte 1.
// A consulta nao possui WHERE nem GROUP BY - os dados sao carregados
// integralmente em memoria e todo filtro ou agregacao ocorre em JavaScript,
// conforme exigido pelo enunciado.
//
// As tres funcoes de agregacao da Parte 2 recebem a lista devolvida por
// buscarTodos() e a processam com map/filter/reduce, sem novas consultas.
// ---------------------------------------------------------------------------
const { pool } = require("./db");
const { Pagamento } = require("./Pagamento");

class PagamentoRepository {
  /**
   * @param {import("mysql2/promise").Pool} pool Pool de conexoes MySQL.
   */
  constructor(pool) {
    this.pool = pool;
  }

  /** Consulta SQL do item (d): JOIN entre as tres tabelas do modelo. */
  static get CONSULTA_COM_JOIN() {
    return `
      SELECT
        p.id_venda,
        p.data_do_pagamento,
        p.valor_do_pagamento,
        i.codigo_imovel,
        i.descricao_imovel,
        t.nome_tipo AS tipo_imovel
      FROM pagamento p
      JOIN imovel i
        ON p.codigo_imovel = i.codigo_imovel
      JOIN tipo_imovel t
        ON i.id_tipo_imovel = t.id_tipo_imovel
      ORDER BY p.id_venda
    `;
  }

  /**
   * Executa a consulta do item (d) e converte cada linha em um objeto de
   * dominio Pagamento.
   * @returns {Promise<Pagamento[]>} Serie historica completa de pagamentos.
   */
  async buscarTodos() {
    const [linhas] = await this.pool.query(PagamentoRepository.CONSULTA_COM_JOIN);
    return linhas.map((linha) => new Pagamento(linha));
  }
}

// Instancia compartilhada pelas rotas da aplicacao.
const pagamentoRepository = new PagamentoRepository(pool);

module.exports = { PagamentoRepository, pagamentoRepository };
