import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../netlify/functions/mcp.js";
import { comprobarPlazo } from "../src/plazo.js";
import { zonaCirculo } from "../src/zona.js";

async function rpc(method: string, params: unknown = {}, id = 1) {
  const res = await handler(
    new Request("http://localhost/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    }),
  );
  assert.equal(res.status, 200, await res.clone().text());
  return (await res.json()) as any;
}

test("initialize devuelve el nombre del servidor", async () => {
  const r = await rpc("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "test", version: "1" },
  });
  assert.equal(r.result.serverInfo.name, "comunicados-fpv");
  assert.match(r.result.instructions, /instrucciones_comunicado/);
});

test("tools/list expone las 3 herramientas, todas de solo lectura", async () => {
  const r = await rpc("tools/list");
  const nombres = r.result.tools.map((t: any) => t.name).sort();
  assert.deepEqual(nombres, ["comprobar_plazo", "crear_zona", "instrucciones_comunicado"]);
  for (const t of r.result.tools) assert.equal(t.annotations.readOnlyHint, true, t.name);
});

test("las instrucciones no dependen de ningún perfil ni Proyecto", async () => {
  const r = await rpc("tools/call", { name: "instrucciones_comunicado", arguments: {} });
  const t: string = r.result.content[0].text;
  assert.doesNotMatch(t, /perfil\.yaml|ubicaciones\.|Proyecto/);
  assert.match(t, /Clonar la comunicación/);
});

test("crear_zona devuelve un polígono cerrado de 17 puntos", async () => {
  const r = await rpc("tools/call", { name: "crear_zona", arguments: { lat: 36.417, lon: -5.152, radio_m: 100 } });
  const z = JSON.parse(r.result.content[0].text);
  assert.equal(z.lugar, "36.41700,-5.15200,17");
  assert.equal(z.poligono.length, 17);
  assert.deepEqual(z.poligono[0], z.poligono[16]);
  assert.equal(JSON.parse(z.mapaValue).features[0].geometry.type, "Polygon");
});

test("crear_zona rechaza coordenadas fuera de España (lon/lat al revés)", async () => {
  const r = await rpc("tools/call", { name: "crear_zona", arguments: { lat: -5.152, lon: 36.417 } });
  assert.equal(r.result.isError, true);
});

test("instrucciones_comunicado incluye las reglas clave", async () => {
  const r = await rpc("tools/call", { name: "instrucciones_comunicado", arguments: {} });
  const t: string = r.result.content[0].text;
  for (const clave of ["dateSelect", "callBehavior('change')", "Firmar y presentar", "ESP-RP"]) {
    assert.ok(t.includes(clave), `falta "${clave}"`);
  }
});

test("plazo: 5 días naturales en hora de España", () => {
  const ahora = new Date("2026-11-05T22:30:00Z"); // 23:30 en Madrid, todavía día 5
  assert.equal(comprobarPlazo("2026-11-10", ahora).cumple, true);
  assert.equal(comprobarPlazo("2026-11-09", ahora).cumple, false);
  assert.equal(comprobarPlazo("2026-11-09", ahora).primer_dia_valido, "2026-11-10");
  const pasadaMedianoche = new Date("2026-11-05T23:30:00Z"); // ya es día 6 en Madrid
  assert.equal(comprobarPlazo("2026-11-10", pasadaMedianoche).cumple, false);
});

test("zona: radio correcto en metros", () => {
  const z = zonaCirculo(36.417, -5.152, 100);
  const [lon, lat] = z.poligono[0];
  assert.ok(Math.abs((lat - 36.417) * 111320 - 100) < 0.5);
  assert.equal(lon, -5.152);
});

test("los errores de validación salen en español", async () => {
  const r = await rpc("tools/call", { name: "crear_zona", arguments: { lat: -5.152, lon: 36.417 } });
  assert.match(r.result.content[0].text, /fuera de España/);
  const f = await rpc("tools/call", { name: "comprobar_plazo", arguments: { fecha: "14/11/2026" } });
  assert.match(f.result.content[0].text, /AAAA-MM-DD/);
});
