SET autocommit = 1;

USE imobiliaria;

DELETE FROM pagamento;
DELETE FROM imovel;
DELETE FROM tipo_imovel;

ALTER TABLE pagamento AUTO_INCREMENT = 1;
ALTER TABLE imovel AUTO_INCREMENT = 1;
ALTER TABLE tipo_imovel AUTO_INCREMENT = 1;

INSERT INTO tipo_imovel (nome_tipo) VALUES
  ('Apartamento'),
  ('Casa'),
  ('Terreno'),
  ('Sala Comercial'),
  ('Galpão');

INSERT INTO imovel (descricao_imovel, id_tipo_imovel) VALUES
  ('Apartamento 100 m² em condomínio fechado', 1),
  ('Apartamento 65 m² próximo ao centro', 1),
  ('Casa geminada com 3 quartos', 2),
  ('Casa de veraneio na praia', 2),
  ('Terreno residencial de esquina', 3),
  ('Terreno comercial na avenida principal', 3),
  ('Sala comercial no centro empresarial', 4),
  ('Sala comercial em galeria', 4),
  ('Galpão industrial com pátio', 5),
  ('Apartamento cobertura duplex', 1);

INSERT INTO pagamento (data_do_pagamento, valor_do_pagamento, codigo_imovel) VALUES
  ('2023-03-10', 5000.00, 1),
  ('2023-05-10', 5000.00, 1),
  ('2023-07-10', 5000.00, 1),
  ('2023-08-10', 5000.00, 1),
  ('2023-03-15', 3200.00, 2),
  ('2023-04-15', 3200.00, 2),
  ('2023-06-15', 3200.00, 2),
  ('2023-03-20', 4500.00, 3),
  ('2023-05-20', 4500.00, 3),
  ('2023-07-20', 4500.00, 3),
  ('2023-08-20', 4500.00, 3),
  ('2023-04-05', 6000.00, 4),
  ('2023-06-05', 6000.00, 4),
  ('2023-08-05', 6000.00, 4),
  ('2023-03-01', 1500.00, 5),
  ('2023-05-01', 1500.00, 5),
  ('2023-07-01', 1500.00, 5),
  ('2023-04-01', 2500.00, 6),
  ('2023-06-01', 2500.00, 6),
  ('2023-08-01', 2500.00, 6),
  ('2023-03-25', 3500.00, 7),
  ('2023-04-25', 3500.00, 7),
  ('2023-05-25', 3500.00, 7),
  ('2023-06-25', 3500.00, 7),
  ('2023-04-10', 2800.00, 8),
  ('2023-06-10', 2800.00, 8),
  ('2023-08-10', 2800.00, 8),
  ('2023-03-05', 7000.00, 9),
  ('2023-05-05', 7000.00, 9),
  ('2023-07-05', 7000.00, 9),
  ('2023-04-20', 6500.00, 10),
  ('2023-06-20', 6500.00, 10),
  ('2023-08-20', 6500.00, 10);
