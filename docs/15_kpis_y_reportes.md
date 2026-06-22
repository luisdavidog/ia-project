---
documento: KPIs y Reportes Operativos
version: 2.2
fecha_emision: 2025-03-18
propietario: Operaciones
---

# KPIs y Reportes Operativos

## KPIs principales
- **Tasa de cumplimiento de SLA:** % de envios entregados dentro del umbral
  vigente. Recuerde: el umbral vigente es el de la politica de reembolsos 2025, no
  el del acuerdo original.
- **Tiempo promedio de entrega:** promedio de `actual_hours` de envios entregados.
  Normalice el estatus para identificar correctamente los entregados.
- **Cartera vencida:** suma de facturas `vencida` por cliente. Reporte aparte las
  facturas sin cliente.
- **Envios huerfanos:** % de envios sin `client_id`. Es un KPI de calidad de datos.

## Buenas practicas de reporte
1. Normalice estatus (casing e idioma) antes de agrupar.
2. Parsee fechas considerando ambos formatos del historico.
3. Maneje explicitamente los envios huerfanos; no los descarte en silencio con un
   INNER JOIN.
4. Para SLA, recalcule desde `actual_hours` con el umbral vigente.

## Cadencia
Reporte semanal operativo y reporte mensual ejecutivo. El reporte ejecutivo se
explica en lenguaje de negocio para audiencias no tecnicas.


## Definiciones operativas de cada KPI
### Tasa de cumplimiento de SLA
`envios entregados dentro del umbral vigente / total de envios entregados`. El
umbral vigente es 24 horas sobre lo comprometido (politica de reembolsos 2025).
Calcular desde `actual_hours`, no desde `breached_flag`.

### Tiempo promedio de entrega
Promedio de `actual_hours` de los envios entregados. Para identificar correctamente
los entregados, normalice las variantes del estatus.

### Cartera vencida
Suma de `amount_mxn` de facturas `vencida`, agrupada por cliente, con las facturas
sin cliente reportadas aparte.

### Envios huerfanos
`envios sin client_id / total de envios`. Es un indicador de calidad de datos, no de
operacion. Un valor alto sugiere problemas de integracion en la captura.

## Plantilla de reporte ejecutivo
1. Resumen en lenguaje de negocio (sin jerga).
2. Tres a cinco KPIs principales con su tendencia.
3. Principales incidencias y su estado.
4. Riesgos de calidad de datos (huerfanos, formatos, estatus inconsistente).
5. Recomendaciones accionables.

## Errores que invalidan un reporte
- Contar envios entregados sin normalizar estatus.
- Calcular duraciones sin normalizar fechas.
- Descartar envios huerfanos con un INNER JOIN silencioso.
- Reportar SLA con el umbral historico de 48 horas.
- Inventar cifras de devoluciones que no existen en los datos.

## Anexo: preguntas tipicas de direccion
- "?Cuantos envios entregamos el mes pasado?" (normalizar estatus + fechas)
- "?Que cliente concentra mas cartera vencida?" (manejar huerfanos)
- "?Cumplimos el SLA?" (umbral vigente, recalculo desde actual_hours)
