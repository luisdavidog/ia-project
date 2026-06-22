import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

// Importamos las funciones ejecutoras desde nuestra capa de servicios (Tools)
// Nota: Deberás crear estos archivos y exportar las funciones correspondientes.
import { ejecutarSql } from "../tools/sql_executor";
import { buscarEnDocumentos } from "../tools/rag_service";
import { ejecutarLlamadaMcp } from "../mcp/mcp_client";

// Inicializamos el cliente
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ============================================================================
// 1. DEFINICIÓN DE HERRAMIENTAS (FUNCTION DECLARATIONS)
// ============================================================================

const toolEjecutarSql: FunctionDeclaration = {
    name: "ejecutar_sql_nordeste",
    description: "Ejecuta una consulta SQL SELECT en la base de datos operativa de Nordeste para obtener datos cuantitativos de envíos, clientes, facturas o SLAs. IMPORTANTE: Solo lectura.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            sql_query: {
                type: Type.STRING,
                description: "La consulta SQL a ejecutar. Tablas disponibles: envios, clientes, facturas, transportistas."
            }
        },
        required: ["sql_query"]
    }
};

const toolBuscarPoliticas: FunctionDeclaration = {
    name: "buscar_politicas_nordeste",
    description: "Busca información en los manuales, políticas de devoluciones, SLAs y FAQs de la empresa (Base de conocimiento interna).",
    parameters: {
        type: Type.OBJECT,
        properties: {
            query: {
                type: Type.STRING,
                description: "La consulta de búsqueda semántica para recuperar fragmentos de documentos relevantes."
            }
        },
        required: ["query"]
    }
};

// ============================================================================
// 2. CONFIGURACIÓN DEL SISTEMA
// ============================================================================

const systemInstruction = `Eres el Copiloto de Operaciones de Nordeste Logística.
Tu objetivo es resolver dudas operativas combinando bases de datos, APIs y documentos internos.

REGLAS ESTRICTAS:
1. NUNCA inventes datos. Si no encuentras la información con tus herramientas, indica claramente que no la tienes.
2. Para métricas, conteos, sumas o información de facturas, usa 'ejecutar_sql_nordeste'.
3. Para reglas de negocio, procedimientos o políticas, usa 'buscar_politicas_nordeste'.
4. Para consultar el estatus en vivo de un envío, usa la herramienta MCP correspondiente (ej. 'get_shipment_status_api').
5. Siempre justifica de dónde sacaste la información (ej. "Según la base de datos..." o "De acuerdo al manual de facturación...").`;

// ============================================================================
// 3. MAPA DE EJECUCIÓN
// ============================================================================

// Este mapa asocia el nombre de la herramienta invocada por la IA con la función TypeScript real.
const mapaEjecutores: Record<string, (args: any) => Promise<any>> = {
    "ejecutar_sql_nordeste": async (args) => await ejecutarSql(args.sql_query),
    "buscar_politicas_nordeste": async (args) => await buscarEnDocumentos(args.query),
    // Las herramientas MCP dinámicas se enrutan a través del cliente MCP
    "get_shipment_status_api": async (args) => await ejecutarLlamadaMcp("get_shipment_status_api", args)
};

// ============================================================================
// 4. EL ORQUESTADOR PRINCIPAL (BUCLE REACT)
// ============================================================================

/**
 * Ejecuta el agente operativo procesando un mensaje del usuario.
 * @param mensajeUsuario La pregunta del usuario.
 * @param herramientasMcp Herramientas dinámicas obtenidas del servidor MCP.
 */
export async function ejecutarAgente(mensajeUsuario: string, herramientasMcp: FunctionDeclaration[] = []): Promise<string> {
    const MAX_ITERACIONES = 5;
    let iteracionActual = 0;

    // Consolidamos las herramientas estáticas (SQL, RAG) con las dinámicas (MCP)
    const herramientasTotales = [toolEjecutarSql, toolBuscarPoliticas, ...herramientasMcp];

    // Inicializamos el chat
    const chat = ai.chats.create({
        model: "gemini-2.5-pro",
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.1, // Baja temperatura para mayor determinismo y menor alucinación
            tools: [{ functionDeclarations: herramientasTotales }]
        }
    });

    try {
        console.log(`\n[User]: ${mensajeUsuario}`);
        let respuesta = await chat.sendMessage({ message: mensajeUsuario });

        // Bucle de intercepción de Function Calling
        while (iteracionActual < MAX_ITERACIONES) {
            const functionCalls = respuesta.functionCalls;

            // Condición de salida: Si el modelo no devuelve llamadas a funciones, nos está dando la respuesta final en texto.
            if (!functionCalls || functionCalls.length === 0) {
                const textoFinal = respuesta.text || "No se generó una respuesta.";
                return textoFinal;
            }

            const toolResponses = [];

            // Procesar cada herramienta que el LLM decidió invocar
            for (const call of functionCalls) {
                console.log(`[Agente] 🛠️ Invocando herramienta: ${call.name}`);
                console.log(`[Agente] 📥 Argumentos:`, call.args);

                const executor = mapaEjecutores[call.name];
                let resultadoEjecucion;

                if (executor) {
                    try {
                        // Ejecutamos la función de negocio real
                        resultadoEjecucion = await executor(call.args);
                    } catch (error: any) {
                        console.error(`[Agente] ❌ Error en ${call.name}:`, error.message);
                        // Le pasamos el error al LLM para que sepa qué falló y pueda autocorregirse
                        resultadoEjecucion = { error: `Ejecución fallida: ${error.message}` };
                    }
                } else {
                    resultadoEjecucion = { error: `Herramienta desconocida o no implementada: ${call.name}` };
                }

                // Empaquetamos la respuesta en el formato que espera Gemini
                toolResponses.push({
                    name: call.name,
                    response: resultadoEjecucion
                });
            }

            console.log(`[Agente] 📤 Devolviendo resultados de la(s) herramienta(s) a Gemini...`);
            
            // Enviamos los resultados de vuelta al chat para que el modelo razone el siguiente paso
            respuesta = await chat.sendMessage({ 
                message: toolResponses 
            });

            iteracionActual++;
        }

        console.warn(`[Agente] ⚠️ Se alcanzó el límite de iteraciones (${MAX_ITERACIONES}). Forzando salida.`);
        return respuesta.text || "Se excedió el límite de pensamiento interno del agente.";

    } catch (error) {
        console.error("[Agente] 🚨 Error crítico en el bucle principal:", error);
        return "Lo siento, ocurrió un error interno en el copiloto y no pude procesar la solicitud.";
    }
}