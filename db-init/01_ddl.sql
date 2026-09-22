CREATE DATABASE IF NOT EXISTS imobiliaria
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE imobiliaria;

DROP TABLE IF EXISTS pagamento;
DROP TABLE IF EXISTS imovel;
DROP TABLE IF EXISTS tipo_imovel;

CREATE TABLE tipo_imovel (
  id_tipo_imovel INT AUTO_INCREMENT PRIMARY KEY,
  nome_tipo      VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE imovel (
  codigo_imovel    INT AUTO_INCREMENT PRIMARY KEY,
  descricao_imovel VARCHAR(255) NOT NULL,
  id_tipo_imovel   INT NOT NULL,
  CONSTRAINT fk_imovel_tipo
    FOREIGN KEY (id_tipo_imovel) REFERENCES tipo_imovel (id_tipo_imovel)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pagamento (
  id_venda           INT AUTO_INCREMENT PRIMARY KEY,
  data_do_pagamento  DATE NOT NULL,
  valor_do_pagamento DECIMAL(10, 2) NOT NULL,
  codigo_imovel      INT NOT NULL,
  CONSTRAINT fk_pagamento_imovel
    FOREIGN KEY (codigo_imovel) REFERENCES imovel (codigo_imovel)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_pagamento_data ON pagamento (data_do_pagamento);
CREATE INDEX idx_pagamento_imovel ON pagamento (codigo_imovel);
CREATE INDEX idx_imovel_tipo ON imovel (id_tipo_imovel);
