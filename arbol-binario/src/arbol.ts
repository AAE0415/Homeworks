// Nodo del árbol binario: un valor y dos referencias (hijo izquierdo y derecho)
export class Nodo {
  valor: number;
  izquierda: Nodo | null;
  derecha: Nodo | null;

  constructor(valor: number) {
    this.valor = valor;
    this.izquierda = null;
    this.derecha = null;
  }
}

export class ArbolBinario {
  raiz: Nodo | null;

  constructor() {
    this.raiz = null;
  }

  // Inserta según el valor: menor a la izquierda, mayor a la derecha.
  // No se permiten valores repetidos.
  insertar(valor: number): void {
    const nuevoNodo = new Nodo(valor);

    if (!this.raiz) {
      this.raiz = nuevoNodo;
      return;
    }

    let actual = this.raiz;
    while (true) {
      if (valor === actual.valor) return;

      if (valor < actual.valor) {
        if (!actual.izquierda) {
          actual.izquierda = nuevoNodo;
          return;
        }
        actual = actual.izquierda;
      } else {
        if (!actual.derecha) {
          actual.derecha = nuevoNodo;
          return;
        }
        actual = actual.derecha;
      }
    }
  }

  // PreOrden: Nodo - Izquierda - Derecha (N-L-R)
  preorden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (!nodo) return resultado;
    resultado.push(nodo.valor);
    this.preorden(nodo.izquierda, resultado);
    this.preorden(nodo.derecha, resultado);
    return resultado;
  }

  // InOrden: Izquierda - Nodo - Derecha (L-N-R)
  inorden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (!nodo) return resultado;
    this.inorden(nodo.izquierda, resultado);
    resultado.push(nodo.valor);
    this.inorden(nodo.derecha, resultado);
    return resultado;
  }

  // PostOrden: Izquierda - Derecha - Nodo (L-R-N)
  postorden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (!nodo) return resultado;
    this.postorden(nodo.izquierda, resultado);
    this.postorden(nodo.derecha, resultado);
    resultado.push(nodo.valor);
    return resultado;
  }

  // 1. Verifica si un valor está en el árbol
  buscar(valor: number): boolean {
    let actual = this.raiz;
    while (actual) {
      if (valor === actual.valor) return true;
      actual = valor < actual.valor ? actual.izquierda : actual.derecha;
    }
    return false;
  }
}

// Estructura que espera react-d3-tree: { name, attributes?, children? }
export interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string>;
  children?: RawNodeDatum[];
}

// 2. Convierte el árbol binario al formato de react-d3-tree.
// El atributo "lado" indica si el hijo es izquierdo o derecho,
// porque cuando un nodo tiene un solo hijo la librería lo dibuja centrado.
export function aFormatoD3(nodo: Nodo, lado?: string): RawNodeDatum {
  const hijos: RawNodeDatum[] = [];
  if (nodo.izquierda) hijos.push(aFormatoD3(nodo.izquierda, 'izq'));
  if (nodo.derecha) hijos.push(aFormatoD3(nodo.derecha, 'der'));

  return {
    name: String(nodo.valor),
    ...(lado && { attributes: { lado } }),
    ...(hijos.length > 0 && { children: hijos }),
  };
}
