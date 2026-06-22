import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Inicializamos el servidor MCP
const server = new Server(
  { name: "nordeste-ops-api", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 1. Exponer la definición de las herramientas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_shipment_status_api",
        description: "Consulta el estatus en tiempo real de un envío a través de la API de Operaciones de Nordeste.",
        inputSchema: {
          type: "object",
          properties: {
            tracking_id: {
              type: "string",
              description: "El ID o número de guía del envío (ej. ENV-1029).",
            },
          },
          required: ["tracking_id"],
        },
      },
    ],
  };
});

// 2. Ejecutar la lógica cuando se invoca la herramienta
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_shipment_status_api") {
    const trackingId = request.params.arguments?.tracking_id;
    
    // Aquí harías el fetch real a la API mockeada en la carpeta /api
    // Para simplificar, simulamos la respuesta de la API:
    const mockApiResponse = {
        tracking_id: trackingId,
        status: "En tránsito",
        current_location: "Monterrey Hub",
        estimated_delivery: "2026-06-23T14:00:00Z"
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(mockApiResponse),
        },
      ],
    };
  }
  throw new Error(`Tool not found: ${request.params.name}`);
});

// Arrancar el servidor
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
    console.error("Servidor MCP de Nordeste corriendo en stdio");
});