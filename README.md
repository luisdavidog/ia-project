# Copiloto Operativo - Nordeste Logística

## 🚀 Cómo ejecutar el proyecto
1. `npm install`
2. Configura tu `.env` con `GEMINI_API_KEY=tu_clave`.
3. Levanta el servidor MCP: `npm run mcp:start` (en una terminal).
4. Ejecuta el agente interactivo: `npm run agent:start` (en otra terminal).
5. (Opcional) Ejecuta el arnés de pruebas: `npm run test:eval`.

## 🧠 Arquitectura y Bitácora de Decisiones
Para este MVP (construido en < 5 horas), la arquitectura prioriza la precisión de los datos y la modularidad técnica por encima de la infraestructura compleja.

*   **El Cerebro (Orquestador):** Implementé un bucle ReAct personalizado utilizando la API de Gemini. Esto permite interceptar los errores de herramientas (ej. un SQL mal formado) y darle al LLM la oportunidad de autocorregirse, aumentando la resiliencia del sistema.
*   **Capa de Datos (Text-to-SQL):** En lugar de vectorizar la base de datos operativa, implementé *Function Calling* directo a SQLite. **¿Por qué?** Las preguntas sobre facturas vencidas o métricas de SLA requieren operaciones matemáticas (sumas, promedios, agrupaciones) donde los LLMs suelen alucinar. Ejecutar SQL real garantiza precisión determinista.
*   **Capa de Conocimiento (RAG):** Opté por inyección de contexto en memoria y *embeddings* locales en lugar de levantar un VectorDB dedicado como Pinecone. Para un corpus de 15 documentos, la latencia de red de un servicio externo no justifica el beneficio en un MVP.
*   **Integración MCP:** El estatus de los envíos se consume a través de un servidor MCP aislado mediante `stdio`. Esto desacopla la API del cliente de IA, permitiendo que en el futuro otros agentes o interfaces consuman las mismas herramientas sin reescribir la integración.

## ✂️ Supuestos y Recortes (Qué haría distinto con más tiempo)
*   **Validación de Esquemas:** Asumí que las consultas SQL generadas por el LLM son seguras (modo solo lectura). En producción, agregaría una capa de validación de AST para evitar inyecciones, o limitaría el acceso con vistas predefinidas de la base de datos.
*   **RAG Híbrido:** Con más tiempo, implementaría búsqueda híbrida (Semántica + Keyword/BM25) para mejorar la recuperación de términos técnicos exactos o códigos de error específicos en las políticas.