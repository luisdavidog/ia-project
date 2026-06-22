import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE_URL = process.env.NORDESTE_API_BASE_URL || "http://127.0.0.1:8000";
const API_TOKEN = process.env.NORDESTE_API_TOKEN || "nordeste-demo-key-2025";

const server = new Server(
  { name: "nordeste-ops-api", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

function extractShipmentId(value: unknown): number {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error("tracking_id debe ser texto o numero.");
  }

  const raw = String(value).trim();
  const match = raw.match(/\d+/);
  if (!match) {
    throw new Error(`No se pudo extraer un shipment_id numerico de '${raw}'.`);
  }

  return Number(match[0]);
}

async function fetchShipmentStatus(trackingId: unknown) {
  const shipmentId = extractShipmentId(trackingId);
  const url = `${API_BASE_URL.replace(/\/$/, "")}/shipments/${shipmentId}/status`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: "application/json",
    },
  });

  const bodyText = await response.text();
  let body: unknown;
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    body = { raw_response: bodyText };
  }

  if (!response.ok) {
    return {
      error: "api_error",
      status_code: response.status,
      detail: body,
    };
  }

  return body;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_shipment_status_api",
        description:
          "Consulta el estatus en tiempo real de un envio a traves de la API de Operaciones de Nordeste.",
        inputSchema: {
          type: "object",
          properties: {
            tracking_id: {
              type: "string",
              description:
                "El ID o numero de guia del envio. Acepta formatos como ENV-1029 o 1029.",
            },
          },
          required: ["tracking_id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_shipment_status_api") {
    const trackingId = request.params.arguments?.tracking_id;
    const apiResponse = await fetchShipmentStatus(trackingId);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(apiResponse),
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.error("Servidor MCP de Nordeste corriendo en stdio");
});
