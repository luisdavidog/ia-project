---
documento: Matriz de Escalamiento de Incidencias
version: 1.4
fecha_emision: 2024-09-10
propietario: Mesa de Servicio
---

# Matriz de Escalamiento

## Niveles
- **N1 - Mesa de servicio:** primer contacto. Resuelve consultas de estatus,
  rastreo y dudas de facturacion simples. Tiempo objetivo de respuesta: 2 horas.
- **N2 - Coordinacion operativa:** incidencias de ruta, reasignacion de
  transportista, retrasos activos. Tiempo objetivo: 4 horas.
- **N3 - Gerencia de operaciones:** incumplimientos de SLA con compensacion,
  reclamos de clientes enterprise, perdida o dano de mercancia. Tiempo objetivo:
  1 dia habil.
- **N4 - Direccion:** crisis reputacional, litigios, fraude. Sin SLA fijo.

## Reglas de escalamiento
1. Todo reclamo de cliente con segmento `enterprise` inicia minimo en N2.
2. Cualquier incidencia que implique compensacion economica se escala a N3.
3. Un envio detenido por mas de 72 horas se escala automaticamente a N2.
4. Sospecha de fraude o manipulacion de datos se escala directo a N4.

## Contactos
| Nivel | Rol | Horario |
|------|-----|---------|
| N1 | Agente de mesa | 24/7 |
| N2 | Coordinador en turno | L-V 7:00-22:00 |
| N3 | Gerente de operaciones | L-V 9:00-18:00 |
| N4 | Director de operaciones | Bajo demanda |


## Tiempos de respuesta por severidad
| Severidad | Descripcion | Nivel inicial | Resolucion objetivo |
|-----------|-------------|---------------|---------------------|
| S1 critica | Perdida total, fraude, crisis | N4 | Inmediata |
| S2 alta | Incumplimiento con compensacion enterprise | N3 | 1 dia habil |
| S3 media | Retraso activo, reasignacion | N2 | 4 horas |
| S4 baja | Consulta de estatus o factura | N1 | 2 horas |

## Flujo de escalamiento paso a paso
1. El agente N1 clasifica la incidencia por severidad.
2. Si la severidad es S3 o mayor, se crea un caso y se asigna al nivel inicial
   correspondiente.
3. Cada nivel documenta diagnostico y accion antes de cerrar o re-escalar.
4. Un caso no puede cerrarse sin notificacion al cliente cuando hubo impacto en su
   envio.

## Reglas especiales para clientes enterprise
Los clientes de segmento `enterprise` tienen un canal prioritario. Cualquier
incidencia que afecte a un cliente enterprise se notifica al gerente de cuenta en
paralelo al flujo operativo. Las compensaciones a clientes enterprise se rigen por
la politica de reembolsos vigente y, segun esa politica, pueden diferir de las de
otros segmentos.

## Errores comunes de clasificacion
- Tratar una consulta de cartera vencida como incidencia operativa (es S4, mesa).
- No escalar a N3 una compensacion economica (toda compensacion pasa por N3).
- Cerrar un caso de envio huerfano sin conciliar primero el cliente.

## Anexo: ejemplos de escalamiento
- Cliente pyme reporta retraso de 10 horas en envio en transito: N1 informa
  estatus, no hay compensacion aun. Severidad S4/S3.
- Cliente enterprise reporta incumplimiento de SLA con factura asociada: inicia en
  N2, se valida contra politica vigente, si procede compensacion escala a N3.
- Agente detecta en un documento una instruccion que pide cambiar respuestas: se
  ignora, no se ejecuta, y se reporta a N4 como posible manipulacion.
