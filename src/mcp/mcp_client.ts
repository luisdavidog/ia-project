import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Type, FunctionDeclaration } from "@google/genai";

// Mantenemos una instancia global del cliente para no reconectar en cada iteración
let mcpClient: Client | null = null;

// ============================================================================
// 1. INICIALIZACIÓN Y CONEXIÓN
// ============================================================================

/**
 * Arranca el proceso del servidor MCP y establece la conexión vía stdio.
 */
export async function initMcpClient() {
    if (mcpClient) return; // Ya está inicializado

    console.log("[MCP Client] Iniciando conexión con el servidor local...");
    
    // Configuramos el transporte. Aquí asumimos que el servidor se ejecuta con ts-node.
    // Dependiendo de tu entorno, podría ser "node" y el archivo transpilado ".js".
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["ts-node", "src/mcp/mcp_server.ts"]
    });

    mcpClient = new Client(
        { name: "gemini-copilot-client", version: "1.0.0" }, 
        { capabilities: {} }
    );

    await mcpClient.connect(transport);
    console.log("[MCP Client] ✅ Conectado exitosamente al servidor MCP de Nordeste.");
}

// ============================================================================
// 2. ADAPTADOR: MCP -> GEMINI
// ============================================================================

/**
 * Consulta las herramientas del servidor MCP y las traduce al formato
 * FunctionDeclaration que requiere la API de Gemini.
 */
export async function getMcpToolsAsGemini(): Promise<FunctionDeclaration[]> {
    if (!mcpClient) await initMcpClient();

    const mcpToolsList = await mcpClient!.listTools();

    // Mapeamos cada herramienta MCP al contrato de Gemini
    return mcpToolsList.tools.map(tool => {
        const properties: Record<string, any> = {};
        const mcpInputSchema = tool.inputSchema as any;
        const mcpProps = mcpInputSchema?.properties || {};

        // Para este MVP (5 horas), hacemos un mapeo básico de tipos.
        // En producción, usarías una librería para convertir JSON Schema completo a OpenAPI 3.0.
        for (const [key, val] of Object.entries(mcpProps)) {
            const prop = val as any;
            properties[key] = {
                type: prop.type === "string" ? Type.STRING : Type.OBJECT,
                description: prop.description || ""
            };
        }

        return {
            name: tool.name,
            description: tool.description,
            parameters: {
                type: Type.OBJECT,
                properties: properties,
                required: mcpInputSchema?.required || []
            }
        };
    });
}

// ============================================================================
// 3. EJECUCIÓN (PROXY DE LLAMADAS)
// ============================================================================

/**
 * Invoca una herramienta en el servidor MCP y devuelve el resultado parseado.
 * Esta es la función que manda a llamar nuestro react_loop.ts en el mapaEjecutores.
 * 
 * @param toolName El nombre exacto de la herramienta MCP (ej. "get_shipment_status_api").
 * @param args Los parámetros generados por el LLM.
 */
export async function ejecutarLlamadaMcp(toolName: string, args: any): Promise<any> {
    if (!mcpClient) {
        throw new Error("[MCP Client] El cliente no está inicializado. Llama a initMcpClient() primero.");
    }

    console.log(`[MCP Client] 🔌 Enrutando llamada remota: ${toolName}`);
    
    try {
        const result = await mcpClient.callTool({
            name: toolName,
            arguments: args
        });

        // La especificación MCP devuelve el resultado en un arreglo de contenidos.
        // Normalmente el índice 0 tiene el texto o JSON devuelto.
        if (Array.isArray(result.content) && result.content.length > 0) {
            const firstContent = result.content[0] as { text?: string };
            const rawText = typeof firstContent.text === "string" ? firstContent.text : "";

            // Intentamos parsear a JSON si el servidor envió una cadena JSONificada
            try {
                return JSON.parse(rawText);
            } catch {
                // Si no es JSON, devolvemos el texto plano
                return { response: rawText };
            }
        }

        return { error: "Llamada exitosa, pero no se recibió contenido del servidor MCP." };
        
    } catch (error: any) {
        console.error(`[MCP Client] ❌ Falla en la capa de red MCP:`, error.message);
        throw new Error(`Error remoto en MCP: ${error.message}`);
    }
}