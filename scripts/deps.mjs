// Instala dependencias FUERA de OneDrive y enlaza node_modules con una unión (junction).
// Uso: node scripts/deps.mjs              -> instala todo (npm install)
//      node scripts/deps.mjs paquete      -> agrega un paquete
//      node scripts/deps.mjs -D paquete   -> agrega un paquete de desarrollo
// Solo hace falta en este computador (la carpeta del proyecto vive en OneDrive).
// En cualquier otra copia del repositorio basta con "npm install".
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, lstatSync, mkdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const proyecto = resolve(import.meta.dirname, '..');
const destino = join(homedir(), 'dev-deps', 'Parcial-3');
const archivos = ['package.json', 'package-lock.json'];

mkdirSync(destino, { recursive: true });
for (const f of archivos) if (existsSync(join(proyecto, f))) copyFileSync(join(proyecto, f), join(destino, f));

const args = process.argv.slice(2).join(' ');
execSync(`npm install ${args}`.trim(), { cwd: destino, stdio: 'inherit' });

for (const f of archivos) if (existsSync(join(destino, f))) copyFileSync(join(destino, f), join(proyecto, f));

const enlace = join(proyecto, 'node_modules');
if (existsSync(enlace) && !lstatSync(enlace).isSymbolicLink()) rmSync(enlace, { recursive: true, force: true });
if (!existsSync(enlace)) execSync(`mklink /J "${enlace}" "${join(destino, 'node_modules')}"`, { shell: 'cmd.exe', stdio: 'ignore' });
console.log('Dependencias listas en', join(destino, 'node_modules'));
