const frutas = ["manzana", "pera", "uva", "kiwi"];
console.log("at(1):", frutas.at(1));  
console.log("at(-1):", frutas.at(-1));


// Concat 

const numA = [1, 2];
const numB = [3, 4];
console.log("concat:", numA.concat(numB));

// Constructor

const arr1 = new Array(1, 2, 3);
console.log("constructor:", arr1);

// CopyWithin

const copia = [1, 2, 3, 4, 5];
console.log("copyWithin:", copia.copyWithin(0, 1));


// entries

const arr2 = ["a", "b", "c"];
const iterator = arr2.entries();
for (const [index, element] of iterator) {
  console.log(`entries: index ${index}, element ${element}`);
}

// every

const numeros = [1, 2,  4];
const todosPares = numeros.every(num => num % 2 === 0);
console.log("every:", todosPares); 

// fill

const numbers = [1, 2, 3, 4, 5, 6];
console.log("filter (pares):", numbers.filter(n => n % 2 === 0)); 

// find

console.log("find (>3):", numbers.find(n => n > 3));

//  findIndex

console.log("findIndex (>3):", numbers.findIndex(n => n > 3));

// findlast

console.log("findLast (par):", numbers.findLast(n => n % 2 === 0));

// findLastIndex

console.log("findLastIndex (par):", numbers.findLastIndex(n => n % 2 === 0));

// flat

const anidado = [1, [2, 3], [4, [5, 6]]];
console.log("flat:", anidado.flat());    
console.log("flat(2):", anidado.flat(2));

// flatMap

const palabras = ["hola mundo", "buenas tardes"];
console.log("flatMap:", palabras.flatMap(p => p.split(" ")));

// forEach

const numeros2 = [1, 2, 3];
numeros2.forEach(num => console.log("forEach:", num * 2));

// includes

console.log("includes(3):", numbers.includes(7));

// indexOf

console.log("indexOf(3):", numbers.indexOf(3));

// join

console.log("join:", numbers.join(", "));

// keys

const keysIterator = numbers.keys();
for (const key of keysIterator) {
  console.log("keys:", key);
}

//  lastIndexOf

console.log("lastIndexOf(3):", numbers.lastIndexOf(3));

// map

console.log("map (x2):", numbers.map(n => n * 2));

// pop

const frutas2 = ["manzana", "pera", "uva"];
const frutaEliminada = frutas2.pop();
console.log("pop:", frutaEliminada);
console.log("frutas2 después de pop:", frutas2);

// push

const nuevaLongitud = frutas2.push("kiwi");
console.log("push:", nuevaLongitud);
console.log("frutas2 después de push:", frutas2);

// reduce

const suma = numbers.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
console.log("reduce (suma):", suma);

// reduceRight

const resta = numbers.reduceRight((acumulador, valorActual) => acumulador + valorActual);
console.log("reduceRight (resta):", resta);

// reverse
console.log("Frutas2 sin reverse:" ,frutas2);
console.log("reverse:", frutas2.reverse());

// shift

const frutaEliminadaShift = frutas2.shift();
console.log("shift:", frutaEliminadaShift);
console.log("frutas2 después de shift:", frutas2);

// slice

const frutas3 = ["manzana", "pera", "uva", "kiwi"];
const frutasCortadas = frutas3.slice(1, 3);
console.log("slice:", frutasCortadas);

// some

console.log("some (>5):", numbers.some(n => n > 5)); 

// sort

const numbers3 = [3, 1, 4, 2];
console.log("sort:", numbers3.sort((a, b) => a - b));

// splice

const splice = [1, 2, 3, 4, 5];
splice.splice(1, 2, "a", "b", "c"); 
console.log("splice:", splice);

// toLocaleString

console.log("toLocaleString:", numbers3.toLocaleString());

// toString

console.log("toString:", numbers3.toString());

// unshift

const inicio = [3, 4, 5];
inicio.unshift(1, 2);
console.log("unshift:", inicio);

// values

for (const valor of frutas3.values()) {
  console.log("values -> valor:", valor);
}



