// Prepara lo que se publica: src/textos.gen.ts con las recetas como módulo TS para la función de Netlify.
import { readFileSync, writeFileSync } from "node:fs";

const ruta = (p) => new URL(`../${p}`, import.meta.url);

writeFileSync(
  ruta("src/textos.gen.ts"),
  `// GENERADO por scripts/generar.mjs: no editar a mano.
export const RECETAS = ${JSON.stringify(readFileSync(ruta("src/recetas.md"), "utf8"))};
`,
);
console.log("Generado: src/textos.gen.ts");
