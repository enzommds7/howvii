// ---------------------------------------------------------------------------
// Classe de dominio Pagamento (paradigma orientado a objetos).
//
// Representa um registro do resultado da consulta com JOIN entre as tabelas
// pagamento, imovel e tipo_imovel. Encapsula a normalizacao dos tipos vindos
// do banco e expoe o mes/ano ja formatado, comportamento reaproveitado pelas
// funcoes de agregacao da Parte 2.
// ---------------------------------------------------------------------------
class Pagamento {
  /**
   * @param {object} linha Linha retornada pela consulta SQL com JOIN.
   */
  constructor(linha) {
    this.id_venda = linha.id_venda;
    this.data_do_pagamento = linha.data_do_pagamento;
    this.valor_do_pagamento = Number(linha.valor_do_pagamento);
    this.codigo_imovel = linha.codigo_imovel;
    this.descricao_imovel = linha.descricao_imovel;
    this.tipo_imovel = linha.tipo_imovel;
  }

  /**
   * Mes e ano do pagamento no formato MM/AAAA, derivado da data sem depender
   * de conversao de fuso horario.
   * @returns {string}
   */
  get mesAno() {
    const [ano, mes] = this.data_do_pagamento.split("-");
    return `${mes}/${ano}`;
  }

  /**
   * Valor formatado como moeda brasileira, para exibicao em relatorios.
   * @returns {string}
   */
  get valorFormatado() {
    return this.valor_do_pagamento.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}

module.exports = { Pagamento };
