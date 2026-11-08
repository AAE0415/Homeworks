import type { ReactNode } from 'react';
import Pagina from './Pagina';

// Cada ítem del menú tiene título, link y componente
export interface ItemMenu {
  titulo: string;
  link: string;
  componente: ReactNode;
}

// Nodo de un árbol n-ario: un valor y una lista de hijos
export class Nodo {
  valor: ItemMenu;
  hijos: Nodo[];

  constructor(valor: ItemMenu) {
    this.valor = valor;
    this.hijos = [];
  }

  agregarHijo(nodo: Nodo): Nodo {
    this.hijos.push(nodo);
    return nodo;
  }
}

// Crea un nodo de menú con su título, link y componente
const item = (titulo: string, link: string) =>
  new Nodo({ titulo, link, componente: <Pagina titulo={titulo} /> });

// Llenado del árbol con menús y submenús
export const raiz = item('Menú', '/');

raiz.agregarHijo(item('Profile', '/profile'));
raiz.agregarHijo(item('Messages', '/messages'));

const settings = raiz.agregarHijo(item('Settings', '/settings'));
settings.agregarHijo(item('Account', '/settings/account'));
settings.agregarHijo(item('Profile', '/settings/profile'));
settings.agregarHijo(item('Security & Privacy', '/settings/security'));
settings.agregarHijo(item('Password', '/settings/password'));
settings.agregarHijo(item('Notification', '/settings/notification'));

const help = raiz.agregarHijo(item('Help', '/help'));
help.agregarHijo(item("FAQ's", '/help/faqs'));
help.agregarHijo(item('Submit a Ticket', '/help/ticket'));
help.agregarHijo(item('Network Status', '/help/network-status'));

raiz.agregarHijo(item('Logout', '/logout'));

// Recorrido DFS: devuelve todos los nodos para crear sus rutas
export function dfs(nodo: Nodo, resultado: Nodo[] = []): Nodo[] {
  resultado.push(nodo);
  for (const hijo of nodo.hijos) {
    dfs(hijo, resultado);
  }
  return resultado;
}
