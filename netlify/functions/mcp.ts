// Endpoint MCP remoto (Streamable HTTP, sin estado) en https://<sitio>.netlify.app/mcp
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { crearServidor } from "../../src/servidor.js";

export default async (req: Request): Promise<Response> => {
  // Sin estado: un servidor y un transporte por petición (las funciones de Netlify no comparten memoria).
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  const server = crearServidor();
  await server.connect(transport);
  try {
    return await transport.handleRequest(req);
  } finally {
    await server.close();
  }
};

export const config = { path: "/mcp" };
