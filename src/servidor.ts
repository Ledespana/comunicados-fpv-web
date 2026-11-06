// Servidor MCP "Comunicados FPV": sin datos personales ni configuración; solo instrucciones y cálculos.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { zonaCirculo } from "./zona.js";
import { comprobarPlazo } from "./plazo.js";
import { RECETAS } from "./textos.gen.js";

export const VERSION = "0.2.0";

const texto = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const json = (o: unknown) => texto(JSON.stringify(o, null, 2));

export function crearServidor(): McpServer {
  const server = new McpServer(
    { name: "comunicados-fpv", version: VERSION },
    {
      instructions:
        "Comunicados FPV: comunicaciones previas de vuelo de dron (UAS) al Ministerio del Interior de España " +
        "(drones.ses.mir.es). Cuando el usuario quiera volar un dron, pida un 'comunicado', 'comunicación de " +
        "vuelo' o 'avisar a Interior', o diga 'configúrame', llama ANTES DE NADA a instrucciones_comunicado y " +
        "síguelas: no hace falta " +
        "ningún archivo, perfil ni configuración previa. Habla en español y sin tecnicismos. Nunca firmes ni " +
        "presentes sin un 'firma' explícito del usuario.",
    },
  );

  server.registerTool(
    "instrucciones_comunicado",
    {
      title: "Instrucciones para un comunicado",
      description:
        "Instrucciones completas y actualizadas para preparar una comunicación previa de vuelo de dron al " +
        "Ministerio del Interior de España con Claude in Chrome. Llámala SIEMPRE antes de nada cuando el usuario " +
        "quiera volar un dron, pida un comunicado o diga 'configúrame'; no hace falta perfil ni configuración previa.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => texto(RECETAS),
  );

  server.registerTool(
    "crear_zona",
    {
      title: "Crear zona de vuelo",
      description:
        "Genera la zona de vuelo circular en el formato del formulario de Interior. Devuelve mapaValue (para " +
        "zona_actN:mapa_value), lugar ('lat,lon,17' para Lugar de protección/recuperación) y poligono ([[lon,lat],...]).",
      inputSchema: {
        lat: z
          .number({ error: "La latitud tiene que ser un número (p. ej. 36.417)." })
          .min(27, { error: "Latitud fuera de España (27 a 44). ¿Has puesto la longitud en lugar de la latitud?" })
          .max(44, { error: "Latitud fuera de España (27 a 44). ¿Has puesto la longitud en lugar de la latitud?" })
          .describe("Latitud en grados decimales (España: 27 a 44)"),
        lon: z
          .number({ error: "La longitud tiene que ser un número (p. ej. -5.152)." })
          .min(-19, { error: "Longitud fuera de España (-19 a 5). ¿Has puesto la latitud en lugar de la longitud?" })
          .max(5, { error: "Longitud fuera de España (-19 a 5). ¿Has puesto la latitud en lugar de la longitud?" })
          .describe("Longitud en grados decimales (España: -19 a 5)"),
        radio_m: z
          .number({ error: "El radio tiene que ser un número de metros." })
          .min(10, { error: "El radio mínimo es 10 m." })
          .max(5000, { error: "El radio máximo es 5000 m." })
          .default(100)
          .describe("Radio en metros (100 sitio concreto, 500 pueblo)"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ lat, lon, radio_m }) => json(zonaCirculo(lat, lon, radio_m)),
  );

  server.registerTool(
    "comprobar_plazo",
    {
      title: "Comprobar plazo de 5 días",
      description:
        "Comprueba si una fecha de vuelo cumple la antelación mínima de 5 días naturales (hora de España) para la " +
        "comunicación previa a Interior.",
      inputSchema: {
        fecha: z
          .string({ error: "Falta la fecha del vuelo." })
          .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "La fecha tiene que ir como AAAA-MM-DD (p. ej. 2026-11-14)." })
          .describe("Primer día de vuelo, AAAA-MM-DD"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ fecha }) => json(comprobarPlazo(fecha)),
  );

  return server;
}
