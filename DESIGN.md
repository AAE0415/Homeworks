---
name: Delilicias
description: Pedidos por encargo para la cena de Navidad, impresos como el almanaque de la tienda.
colors:
  papel: "#FBFAF6"
  papel-sombra: "#F1EEE6"
  blanco: "#FFFFFF"
  tinta: "#161412"
  tinta-suave: "#4A4540"
  tinta-tenue: "#6E675F"
  filete: "#D9D3C7"
  rojo: "#D8261C"
  rojo-hondo: "#A8180F"
  rojo-velo: "#FBE7E4"
  rojo-noche: "#FF5A4E"
  verde: "#0E5C3A"
  verde-hondo: "#0A4A2E"
  verde-velo: "#E3F0E8"
  dorado: "#C9A24A"
  papel-noche: "#E9E4DA"
  papel-noche-tenue: "#B8B0A4"
typography:
  numeral:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(4.5rem, 8.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.82
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 7vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.02em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  marca:
    fontFamily: "Grand Hotel, cursive"
    fontSize: "2.15rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.005em"
rounded:
  filo: "2px"
  sello: "3px"
  pastilla: "999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "64px"
  s9: "96px"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.filo}"
    padding: "0 24px"
    height: "48px"
  button-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
  button-rojo:
    backgroundColor: "{colors.rojo}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.filo}"
    padding: "0 24px"
    height: "48px"
  button-rojo-hover:
    backgroundColor: "{colors.rojo-hondo}"
    textColor: "{colors.blanco}"
  button-verde:
    backgroundColor: "{colors.verde}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.filo}"
    padding: "0 24px"
    height: "48px"
  button-verde-hover:
    backgroundColor: "{colors.verde-hondo}"
  button-chico:
    padding: "0 16px"
    height: "40px"
  control:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    rounded: "{rounded.filo}"
    padding: "12px 16px"
    height: "48px"
  sello:
    backgroundColor: "transparent"
    textColor: "{colors.rojo}"
    rounded: "{rounded.sello}"
    padding: "0.28em 0.7em 0.22em"
  sello-verde:
    textColor: "{colors.verde}"
  sello-tinta:
    textColor: "{colors.tinta}"
  sello-pendiente:
    textColor: "{colors.tinta-tenue}"
  celda:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-tenue}"
    rounded: "0"
    padding: "4px 8px"
    height: "66px"
  celda-entrega:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
  celda-entrega-hover:
    backgroundColor: "{colors.rojo-velo}"
  riel:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel-noche}"
    padding: "24px 16px"
    width: "248px"
  riel-item-actual:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.filo}"
---

# Design System: Delilicias

## Overview

**Creative North Star: "El almanaque de la tienda"**

Delilicias se imprime como el almanaque que regala la tienda del barrio en diciembre: una hoja de papel bond, dos tintas (negra y rojo almanaque), la foto del plato como lámina y las fechas de entrega como una cuadrícula que de verdad funciona. Todo lo que el sistema dibuja viene de ese objeto: filetes finos, celdas de fecha, numerales enormes, un óvalo rojo trazado a mano alrededor del 24 y del 31, sellos de goma para los estados y una línea perforada entre hojas.

La densidad es de impreso, no de app: superficies planas, bordes de un trazo, esquinas casi rectas. El verde pino entra como segunda tinta solo para lo confirmado y el dorado solo en el filete del membrete. El panel de la administradora es el mismo almanaque en modo de trabajo: un riel de tinta a la izquierda y los días como columnas de tickets.

El movimiento es tinta que se dibuja: el óvalo se traza con `stroke-dashoffset` y el sello se estampa. No hay nada más que se mueva por gusto.

**Key Characteristics:**
- Papel bond con impresión a dos tintas; el rojo marca fechas, numerales y la acción principal.
- Numerales y titulares condensados en mayúsculas (Big Shoulders Display); texto en Schibsted Grotesk; la marca en Grand Hotel.
- Cuadrícula de filetes: líneas de 1px color filete, reglas de 3px en tinta bajo cada encabezado.
- Estados como sellos de goma girados -2°.
- Planitud: casi sin sombras; la profundidad la da el blanco sobre papel y el borde de tinta.

## Colors

Papel cálido y dos tintas de imprenta, con una segunda tinta verde para lo confirmado y un toque de dorado en el membrete.

### Primary
- **Rojo almanaque** (`rojo`): fechas de entrega, numerales de sección, la marca, el óvalo a mano, el sello "En cocina" y el botón principal (Armar mi canasta, Pagar anticipo). También es el anillo de foco y la selección de texto.
- **Rojo hondo** (`rojo-hondo`): hover del botón rojo, textos de error y avisos de límite ("último día para el 24"), enlaces de texto.
- **Velo rojo** (`rojo-velo`): fondo de la celda o fecha elegida, hover de filas y sugerencias, halo de foco de los campos.

### Secondary
- **Verde pino** (`verde`): solo lo confirmado: sello "Anticipo confirmado", botón Confirmar, indicador en vivo, domicilio gratis. Hover en `verde-hondo`.
- **Velo verde** (`verde-velo`): franjas de promesa y comprobante aceptado.

### Tertiary
- **Dorado** (`dorado`): únicamente el filete doble bajo el membrete. No se usa en texto ni en fondos.

### Neutral
- **Papel** (`papel`): fondo de página.
- **Papel sombra** (`papel-sombra`): celdas vacías del mes, barras de cupo, puntos de la perforación.
- **Blanco** (`blanco`): la hoja sobre el papel: lámina, tickets, recibo, campos, celdas de entrega.
- **Tinta** (`tinta`): texto, bordes de lámina, reglas de encabezado, el riel admin y la franja de condiciones.
- **Tinta suave** (`tinta-suave`): bajadas y descripciones.
- **Tinta tenue** (`tinta-tenue`): ayudas, unidades, días fuera de entrega, sello pendiente.
- **Filete** (`filete`): las líneas de la cuadrícula y el borde en reposo de los campos.
- **Sobre tinta** (`papel-noche`, `papel-noche-tenue`, `rojo-noche`): texto claro, texto secundario y la marca roja sobre superficies de tinta (riel y barra móvil del admin).

### Named Rules
**The Dos Tintas Rule.** Cada pantalla se imprime en tinta y rojo. El verde aparece solo cuando algo está confirmado; si no hay confirmación en pantalla, no hay verde.

**The Filete Dorado Rule.** El dorado vive solo en el filete del membrete. Ningún otro elemento lo usa.

## Typography

**Display Font:** Big Shoulders Display (con Arial Narrow, sans-serif)
**Body Font:** Schibsted Grotesk (con system-ui, sans-serif)
**Brand Font:** Grand Hotel (con cursive), solo para la marca

Las tres familias están autoalojadas en `public/fonts` (woff2, subconjuntos latin y latin-ext, `font-display: swap`).

**Character:** Big Shoulders es el numeral del almanaque: condensado, negro y en mayúsculas; Schibsted Grotesk es la letra de la tienda, clara y de cuerpo firme. Grand Hotel firma como el rótulo pintado del local.

### Hierarchy
- **Numeral** (900, hasta 9rem, interlineado 0.82, cifras tabulares): el mes, el día del pedido, los números de sección y posición, cupos y anticipo. Siempre en rojo o tinta.
- **Display** (800, clamp(3rem, 7vw, 5.5rem), 0.95): titular de página (Menú, Checkout), con `text-wrap: balance`.
- **Headline** (800, clamp(2rem, 4vw, 3rem), 0.95): encabezados de sección sobre una regla de 3px.
- **Title** (800, 1.2–1.9rem, 1–1.05, mayúsculas): nombres de platos, pasos, bloques del checkout, días del admin.
- **Body** (400, 1rem, 1.55): texto corrido; bajadas a 34–46ch.
- **Body pequeño** (400, 0.85–0.92rem): notas, ayudas, ítems del recibo.
- **Label** (700–800, 1–1.15rem, tracking 0.05–0.1em, mayúsculas): navegación, botones, sellos, días de la semana.
- **Marca** (Grand Hotel 400, 2.15rem; 1.7–2rem en pie y admin): solo la palabra Delilicias.

### Named Rules
**The Numeral Manda Rule.** Toda cifra que el usuario decide con ella (fecha, cupos, precio, anticipo) se compone en Big Shoulders con cifras tabulares, nunca en el cuerpo de texto.

**The Una Firma Rule.** Grand Hotel se usa únicamente para la marca. Nunca para titulares ni acentos.

## Layout

Contenedor de hoja de 1320px máximo con 32px de margen lateral (16px bajo 900px). Escala de espaciado de 4 (`s1`–`s9`: 4 a 96px); las secciones se separan con 96px (`s9`), 64px en móvil.

La portada usa 12 columnas en proporción 7/5: lámina a la izquierda a casi toda la altura (min(76vh, 720px)), almanaque a la derecha. La cuadrícula del mes es de 7 columnas iguales con celdas de 66px de alto (58px en móvil). El menú usa un lateral fijo de 220px y listas a dos columnas; el checkout, contenido y un recibo fijo de 400px.

El admin es una rejilla de 248px de riel + área de trabajo; la agenda pone los días como dos columnas de tickets (una bajo 1000px). Bajo 900px todo colapsa a una columna, la navegación del membrete se oculta y el riel se convierte en una barra de tinta fija arriba.

Los objetivos táctiles miden 44–48px (botones 48px, chico 40px, flechas y agregar 44px).

## Elevation & Depth

El sistema es plano. La profundidad se da por tono y trazo: hojas blancas sobre papel, bordes de tinta de 1px y reglas de 3px. Hay una sola sombra, reservada para lo que flota sobre la página.

### Shadow Vocabulary
- **Sombra flotante** (`box-shadow: 0 1px 2px rgba(22,20,18,.06), 0 12px 28px -12px rgba(22,20,18,.22)`): solo la lista de sugerencias del buscador y paneles que se superponen.
- **Filete del membrete** (`box-shadow: 0 3px 0 -2px #FBFAF6, 0 4px 0 -2px #C9A24A`): no es sombra; dibuja el filete dorado doble bajo el borde de tinta.

### Named Rules
**The Hoja Plana Rule.** Las superficies en reposo no tienen sombra. Si algo necesita separarse, recibe fondo blanco y un borde de tinta.

## Shapes

Esquinas de imprenta: 2px en botones, campos y elementos del riel; 3px en los sellos; 0 en celdas, láminas, tickets y recibos. Solo los contadores son pastillas (999px) y los puntos en vivo son círculos.

Las líneas son el material: 1px `filete` para la cuadrícula, 1px `tinta` para enmarcar láminas e imágenes, 1.5px `tinta` en botones y campos activos, 3px `tinta` bajo encabezados, y discontinuas (1px dashed `filete`) para renglones de recibo y estados.

Dos formas a mano rompen la retícula: el óvalo rojo que encierra fechas y el sello girado -2°.

## Components

### Buttons
Sólidos y de imprenta, en mayúsculas condensadas.
- **Shape:** casi rectos (2px), 48px de alto, borde de 1.5px.
- **Base:** contorno de tinta sobre transparente; al pasar el cursor se llena de tinta con texto papel.
- **Rojo:** la acción principal de cada pantalla; hover a rojo hondo.
- **Verde:** solo para confirmar (anticipos en el admin); hover a verde hondo.
- **Chico:** 40px de alto, 16px de relleno, 1rem.
- **Active:** baja 1px. **Disabled:** opacidad 0.45.
- **Botón de texto:** subrayado en rojo hondo, sin borde, para acciones secundarias (deshacer, editar).
- **Contador de canasta:** pastilla blanca con cifra roja dentro del botón Canasta.

### Inputs / Fields
- **Style:** fondo blanco, borde de 1.5px `filete`, esquinas de 2px, 48px de alto; etiqueta en 600 / 0.92rem arriba, ayuda en `tinta-tenue` abajo. Cursor de escritura rojo.
- **Hover:** el borde pasa a `tinta-tenue`.
- **Focus:** borde de tinta y halo de 3px en `rojo-velo`.
- **Error:** borde rojo y ayuda en rojo hondo, peso 500.

### Navigation
- **Membrete:** barra fija de papel con borde inferior de tinta y filete dorado doble; marca a la izquierda, enlaces en label de mayúsculas, la página actual subrayada con 2px rojo; Canasta a la derecha. En móvil se ocultan los enlaces y el subtítulo de la marca.
- **Riel admin:** columna de tinta de 248px, marca en `rojo-noche`, enlaces en `papel-noche`; hover con velo claro al 8 %, ítem actual invertido a papel con texto tinta en 700; contadores en pastilla roja. Bajo 900px se vuelve barra superior de tinta con botón de 44px.

### Sello de goma (firma)
Etiqueta de estado con borde de 2px del color de la tinta, esquinas de 3px, label en mayúsculas 800 con tracking 0.08em, girada -2°. Rojo para "En cocina", verde para confirmado, tinta para recibido o agotado, y `tinta-tenue` con borde discontinuo y sin giro para lo que aún no pasa. El estado actual se estampa una vez (escala 1.5 a 1, 0.7s).

### Óvalo a mano (firma)
Trazo SVG rojo de 2.4–2.6px, extremos redondeados, que desborda la cifra que encierra. Marca el 24 y el 31 en el almanaque y la fecha elegida en el checkout. Al elegir una fecha se dibuja con `stroke-dashoffset` en 0.9s; con movimiento reducido aparece completo.

### Celda de fecha
Celda de la cuadrícula de 7 columnas con filetes a la derecha y abajo. Los días sin entrega van en `tinta-tenue`, los vacíos en `papel-sombra`, los festivos con cifra roja. Las celdas de entrega son blancas, con cifra roja más grande, cupos restantes en numeral y velo rojo al pasar o al estar elegidas (`aria-pressed`). La celda límite lleva su aviso en rojo hondo.

### Perforación
Franja de 10px entre lámina y cuadrícula: puntos de `papel-sombra` cada 14px sobre una línea discontinua de filete. Separa "hojas" del almanaque, nunca secciones cualquiera.

### Cards / Containers
- **Corner Style:** rectas (0).
- **Background:** blanco sobre papel.
- **Shadow Strategy:** ninguna (ver Hoja Plana).
- **Border:** 1px tinta para láminas, recibos y hojas del día; 1px filete para tickets, que pasan a tinta cuando son urgentes.
- **Internal Padding:** 12–24px; cabeceras cerradas con regla de 3px de tinta.

## Do's and Don'ts

### Do:
- **Do** marcar fechas de entrega con el óvalo rojo trazado a mano y dibujarlo solo cuando el usuario elige.
- **Do** usar sellos de goma para todo estado de pedido o plato (Recibido, Anticipo confirmado, En cocina, Agotado).
- **Do** cerrar cada encabezado de sección con una regla de tinta de 3px y separar filas con filetes de 1px.
- **Do** componer cifras de fecha, cupo y precio en Big Shoulders con cifras tabulares.
- **Do** respetar `prefers-reduced-motion`: el óvalo aparece trazado y las transiciones se anulan.

### Don't:
- **Don't** usar verde para algo que no esté confirmado.
- **Don't** usar el dorado fuera del filete del membrete.
- **Don't** redondear tarjetas ni botones más allá de 2–3px; las pastillas son solo para contadores.
- **Don't** poner sombras en superficies en reposo.
- **Don't** usar Grand Hotel fuera de la marca.
- **Don't** armar la portada como titular, botón y una fila de tarjetas iguales.
