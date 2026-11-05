// Prepara lo que se publica:
//  - src/textos.gen.ts: recetas y plantilla de perfil como módulo TS para la función de Netlify.
//  - public/descargas/: la skill en .zip (para subir a claude.ai) y la plantilla de perfil.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { zipSync, strToU8 } from "fflate";

const ruta = (p) => new URL(`../${p}`, import.meta.url);
const leer = (p) => readFileSync(ruta(p), "utf8");

writeFileSync(
  ruta("src/textos.gen.ts"),
  `// GENERADO por scripts/generar.mjs: no editar a mano.
export const RECETAS = ${JSON.stringify(leer("src/recetas.md"))};
export const PLANTILLA_PERFIL = ${JSON.stringify(leer("proyecto/perfil.ejemplo.yaml"))};
`,
);

mkdirSync(ruta("public/descargas"), { recursive: true });
const fecha = new Date("2026-01-01T00:00:00Z"); // fija: el zip sale igual en cada build
writeFileSync(
  ruta("public/descargas/comunicado-vuelo.zip"),
  zipSync({ "comunicado-vuelo/SKILL.md": [strToU8(leer("skill/comunicado-vuelo/SKILL.md")), { mtime: fecha }] }),
);
writeFileSync(ruta("public/descargas/perfil.yaml"), leer("proyecto/perfil.ejemplo.yaml"));
console.log("Generados: src/textos.gen.ts, public/descargas/comunicado-vuelo.zip, public/descargas/perfil.yaml");
