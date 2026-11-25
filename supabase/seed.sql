-- Delilicias · Datos iniciales. Ejecutar después de schema.sql.
-- Platos, precios y descripciones tomados del menú real de Delilicias.

insert into public.configuracion (id, whatsapp, domicilio_gratis_desde, anticipo)
values (1, '573152377306', 149900, 50)
on conflict (id) do update set whatsapp = excluded.whatsapp, domicilio_gratis_desde = excluded.domicilio_gratis_desde, anticipo = excluded.anticipo;

insert into public.fechas_entrega (texto, fecha, pedir_hasta, cupo) values
  ('24 de diciembre', '2026-12-24', '2026-12-17', 40),
  ('31 de diciembre', '2026-12-31', null, 40)
on conflict (fecha) do update set texto = excluded.texto, pedir_hasta = excluded.pedir_hasta, cupo = excluded.cupo;

insert into public.categorias (id, numeral, titulo, subtitulo, nota, orden) values
  ('entradas', 'I', 'Entradas', 'Para abrir la noche', null, 1),
  ('fuertes', 'II', 'Platos fuertes', 'El centro de tu cena', 'Carnes 100% magras · Preparaciones sin aditivos ni conservantes', 2),
  ('acompanantes', 'III', 'Acompañantes', 'Para completar tu mesa', null, 3)
on conflict (id) do update set numeral = excluded.numeral, titulo = excluded.titulo, subtitulo = excluded.subtitulo, nota = excluded.nota, orden = excluded.orden;

insert into public.productos (id, categoria_id, nombre, descripcion, ingredientes, precio, unidad, foto_url, alt, disponible, destacado, orden) values
  ('dip-queso-tocineta', 'entradas', 'Dip de queso crema y tocineta', 'Dip de queso crema con pimentón caramelizado y tocineta ahumada, acompañado de galletas Ritz.', array['queso crema', 'pimentón', 'tocineta', 'galletas']::text[], 44900, '350 g', '/img/dip-queso-tocineta.jpg', 'Dip de queso crema con tocineta y galletas', true, true, 1),
  ('rollo-mixto', 'fuertes', 'Rollo mixto', 'Tres carnes con vegetales, envuelto en tocineta y bañado en salsa de la casa.', array['cerdo', 'res', 'pollo', 'vegetales', 'tocineta']::text[], 52500, 'libra', '/img/rollo-mixto.jpg', 'Rollo mixto en tajadas', true, true, 2),
  ('lomo-frutos-secos', 'fuertes', 'Lomo de cerdo relleno en frutos secos', 'Lomo de cerdo enrollado con un relleno de frutos secos, dorado al horno.', array['cerdo', 'lomo', 'frutos secos', 'nueces']::text[], 46500, 'libra', '/img/lomo-frutos-secos.jpg', 'Lomo de cerdo relleno de frutos secos en rodajas', true, false, 3),
  ('costilla-san-luis', 'fuertes', 'Costilla San Luis en salsa caramelizada', 'Costilla de cerdo corte San Luis, horneada lentamente y glaseada en salsa caramelizada.', array['cerdo', 'costilla', 'salsa caramelizada']::text[], 45900, 'libra', '/img/costilla-san-luis.jpg', 'Costilla San Luis en salsa caramelizada', true, true, 4),
  ('cordon-bleu', 'fuertes', 'Cordon bleu', 'Pechuga de pollo rellena de jamón y queso, dorada y bañada en salsa cremosa.', array['pollo', 'jamón', 'queso', 'salsa cremosa']::text[], 37500, 'libra', '/img/cordon-bleu.jpg', 'Cordon bleu en rodajas con salsa cremosa', true, false, 5),
  ('pollo-relleno', 'fuertes', 'Pollo relleno', 'Rollo de pollo relleno de huevo, aceitunas y vegetales, dorado al horno.', array['pollo', 'huevo', 'aceitunas', 'vegetales']::text[], 49500, 'libra', '/img/pollo-relleno.jpg', 'Pollo relleno con huevo y vegetales', true, false, 6),
  ('jamon-pollo', 'fuertes', 'Jamón de pollo', 'Jamón de pollo horneado y sazonado con especias, servido en tajadas.', array['pollo', 'especias']::text[], 35000, 'libra', '/img/jamon-pollo.jpg', 'Jamón de pollo en tajadas', true, false, 7),
  ('galantina-pollo', 'fuertes', 'Galantina de pollo', 'Galantina de pollo con frutas secas y vegetales, servida fría en rodajas.', array['pollo', 'frutas secas', 'vegetales']::text[], 35000, 'libra', '/img/galantina-pollo.jpg', 'Galantina de pollo en rodajas', true, false, 8),
  ('bondiola-caramelizada', 'fuertes', 'Bondiola caramelizada', 'Bondiola de cerdo horneada y glaseada en salsa caramelizada, servida en tajadas.', array['cerdo', 'bondiola', 'salsa caramelizada']::text[], 46500, 'libra', '/img/bondiola-caramelizada.jpg', 'Bondiola caramelizada en tajadas', true, true, 9),
  ('lomo-arandanos', 'fuertes', 'Lomo de cerdo en salsa de arándanos', 'Lomo de cerdo dorado al horno, servido en tajadas y bañado en salsa de arándanos.', array['cerdo', 'lomo', 'arándanos']::text[], 46500, 'libra', '/img/lomo-arandanos.jpg', 'Lomo de cerdo en tajadas con salsa de arándanos', true, true, 10),
  ('solomillo-champinones', 'fuertes', 'Solomillo de cerdo en salsa de champiñones', 'Solomillo de cerdo jugoso, bañado en una salsa cremosa de champiñones.', array['cerdo', 'solomillo', 'champiñones', 'salsa cremosa']::text[], 52500, 'libra', '/img/solomillo-champinones.jpg', 'Solomillo de cerdo en salsa de champiñones', true, false, 11),
  ('arroz-maicitos-tocineta', 'acompanantes', 'Arroz con maicitos y tocineta', 'Arroz suelto con maicitos dulces y tocineta, el acompañante perfecto para tu cena navideña.', array['arroz', 'maíz', 'tocineta']::text[], 8500, 'porción', '/img/arroz-maicitos-tocineta.jpg', 'Arroz con maicitos y tocineta servido en plato blanco', true, false, 12),
  ('arroz-verde', 'acompanantes', 'Arroz verde', 'Arroz suelto con hierbas frescas, un acompañante suave y lleno de color.', array['arroz', 'hierbas']::text[], 6500, 'porción', '/img/arroz-verde.jpg', 'Arroz verde servido en plato blanco', true, false, 13),
  ('ensalada-dulce', 'acompanantes', 'Ensalada dulce', 'Lechuga batavia, lechuga crespa, zanahoria, habichuelas, manzanas, arándanos, piña caramelizada, queso mozzarella y jamón, aderezada con yogur griego y crema de leche.', array['lechuga', 'zanahoria', 'manzana', 'arándanos', 'piña', 'queso mozzarella', 'jamón', 'yogur']::text[], 7800, 'porción', '/img/ensalada-dulce.jpg', 'Ensalada dulce con manzana, arándanos y piña caramelizada', true, true, 14),
  ('ensalada-rusa', 'acompanantes', 'Ensalada rusa', 'Papa, jamón, arveja, zanahoria, habichuelas y cebolla al gusto, aderezada con mayonesa y crema de leche.', array['papa', 'jamón', 'arveja', 'zanahoria', 'mayonesa']::text[], 6800, 'porción', '/img/ensalada-rusa.jpg', 'Ensalada rusa con huevo y perejil', true, false, 15)
on conflict (id) do update set categoria_id = excluded.categoria_id, nombre = excluded.nombre, descripcion = excluded.descripcion, ingredientes = excluded.ingredientes, precio = excluded.precio, unidad = excluded.unidad, foto_url = excluded.foto_url, alt = excluded.alt, orden = excluded.orden;
