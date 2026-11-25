# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + Vite (JavaScript, `.jsx` + `.module.scss`), React Router 6, Context API y custom hooks, Supabase (Auth, Postgres con RLS, Realtime, Storage), Leaflet + OpenStreetMap, Vitest. Despliegue en Netlify. Elegido con el usuario según la rúbrica del curso (ver `docs/superpowers/specs/2026-11-24-delilicias-plataforma-design.md`).

## Users

- **Clientes en Cali** que encargan la cena de Navidad (24 o 31 de diciembre) para su familia. Usan celular y computador por igual.
- **La administradora de Delilicias**, que confirma anticipos, organiza la producción de la cocina, gestiona el menú y los cupos por fecha. También usa celular y computador.
- **Evaluador del curso** (profesor de Estructuras de Datos II, UAO): revisa la plataforma, la propuesta gráfica y la sustentación.

## Product Purpose

Plataforma de pedidos por encargo para Delilicias. Reemplaza un menú estático que terminaba en un mensaje de WhatsApp sin registro: ahora el pedido queda guardado, los cupos por fecha se controlan solos, el cliente sigue su pedido en vivo y la cocina trabaja con una bandeja de anticipos y una agenda ordenada por urgencia.

Éxito, en orden: (1) cumplir con claridad la rúbrica del proyecto final de la materia, con las estructuras de datos usadas de verdad en el flujo; (2) si se implementa bien, que sirva al negocio real.

## Positioning

Es la cocina de una persona, por encargo y por temporada: pocos platos caseros (rollos, lomos, costillas, acompañantes), cupos limitados, anticipo del 50 % y trato directo por WhatsApp. No es un marketplace ni una app de domicilios inmediatos.

## Operating Context

- Temporada navideña; fechas de entrega 24 de diciembre (pedidos hasta el 17 de diciembre) y 31 de diciembre. Cupos limitados por fecha.
- Platos fuertes se venden por libra y se porcionan en 3, 4 o 5 porciones; entradas y acompañantes por unidad o peso.
- Anticipo del 50 % para confirmar (Nequi, transferencia o efectivo); el cliente sube el comprobante y la administradora lo confirma.
- Domicilio gratis en compras desde $149.900; si no, se acuerda por WhatsApp. No hay tarifa automática.
- La conversación con el cliente ocurre por WhatsApp; la plataforma solo abre el chat con el pedido ya escrito.

## Capabilities and Constraints

- Público: inicio, menú por secciones, buscador con autocompletado, detalle de plato, canasta con deshacer, mapa de cobertura, login y registro.
- Cliente: checkout con fecha/barrio/dirección, comprobante del anticipo, mis pedidos, pedido en vivo (estado en tiempo real), perfil con teléfono obligatorio.
- Administración: bandeja de anticipos (orden de llegada), agenda de cocina (por fecha de entrega), detalle de pedido, menú, cupos, resumen.
- Estructuras de datos obligatorias y visibles en el flujo: cola, pila, lista circular, árbol n-ario, trie, heap, grafo.
- Sin chat interno, sin pasarela de pago, sin repartidor con GPS.
- Interfaz y contenidos en español (Colombia), moneda COP sin decimales.

## Brand Commitments

- Nombre: **Delilicias** (Cali). Lema del sitio actual: "La cena de Navidad, lista para tu mesa"; "Tú pones la familia, nosotros la cena".
- Secciones del menú con numerales romanos: I Entradas ("Para abrir la noche"), II Platos fuertes ("El centro de tu cena"), III Acompañantes ("Para completar tu mesa").
- Promesa de producto: "Carnes 100% magras · Preparaciones sin aditivos ni conservantes".

## Evidence on Hand

- 15 fotos reales de los platos en `public/img/` (más `vista-previa.jpg`), con nombres, descripciones y precios reales tomados del sitio actual de Delilicias.
- No hay testimonios, reseñas, cifras de clientes ni prensa: no inventarlos.

## Product Principles

1. Pedir debe ser obvio: el cliente entiende anticipo, fecha límite y domicilio antes de pagar.
2. La comida manda: las fotos reales de los platos son el contenido principal.
3. Cada estructura de datos resuelve un problema visible del negocio; nada decorativo.
4. Lo personal se mantiene: WhatsApp sigue siendo el canal humano.
5. Funciona igual de bien en celular y en computador.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste suficiente, foco visible, navegación completa con teclado, formularios con etiquetas y errores claros, respeto de `prefers-reduced-motion`.
