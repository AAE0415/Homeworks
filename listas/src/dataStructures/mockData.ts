import type { Song, VisitedPage } from "../types";

// Datos simulados para la lista simplemente enlazada (reproductor de canciones)
export const MOCK_SONGS: Song[] = [
  { title: "Bohemian Rhapsody", artist: "Queen" },
  { title: "Imagine", artist: "John Lennon" },
  { title: "Billie Jean", artist: "Michael Jackson" },
  { title: "Hotel California", artist: "Eagles" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin" },
];

// Datos simulados para la lista doblemente enlazada (historial de navegación)
export const MOCK_HISTORY: VisitedPage[] = [
  { title: "Inicio", url: "/home" },
  { title: "Catálogo de productos", url: "/productos" },
  { title: "Detalle del producto", url: "/productos/123" },
  { title: "Carrito de compras", url: "/carrito" },
  { title: "Checkout", url: "/checkout" },
];
