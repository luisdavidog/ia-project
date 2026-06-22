---
documento: Acuerdos con Transportistas
version: 1.1
fecha_emision: 2024-08-01
propietario: Operaciones
---

# Acuerdos con Transportistas

## Transportistas activos
| Transportista | Tipo | Cobertura principal | Notas |
|---------------|------|---------------------|-------|
| TransNorte | terrestre | Noreste, Bajio | Mayor volumen |
| AeroCarga MX | aereo | Nacional | Urgencias y alto valor |
| UltimaMilla Express | ultima_milla | Zonas metropolitanas | Entrega final |
| Fletes Bravo | terrestre | Occidente, centro | |
| RutaMaya Cargo | terrestre | Sureste | Mayor variabilidad de tiempos |

## Penalizaciones a transportistas
Cuando un incumplimiento de SLA es atribuible al transportista, Nordeste aplica una
penalizacion contractual. La atribucion se determina en el analisis de incidencia
(N2/N3). RutaMaya Cargo presenta historicamente la mayor tasa de variabilidad en
tiempos de entrega, especialmente en rutas al sureste.

## Evaluacion trimestral
Cada trimestre se evalua a los transportistas por tasa de cumplimiento de SLA,
incidencias y costo. La evaluacion usa la politica de SLA vigente al cierre del
trimestre.


## Detalle por transportista
### TransNorte (terrestre)
Mayor volumen de la red. Buen desempeno en el corredor noreste y Bajio. Penalizacion
contractual por incumplimiento atribuible documentado.

### AeroCarga MX (aereo)
Cobertura nacional para urgencias. Tiempos consistentes pero costo elevado. SLA
tipico de 24 horas.

### UltimaMilla Express (ultima milla)
Entrega final metropolitana. Soporta reintentos y cita programada. Indicador clave:
tasa de entrega en primer intento.

### Fletes Bravo (terrestre)
Occidente y centro. Desempeno estable en Zona B.

### RutaMaya Cargo (terrestre)
Sureste. Presenta la mayor variabilidad de tiempos, en particular en rutas hacia
Merida (Zona C). Es el transportista con mayor tasa historica de dispersion en
`actual_hours`.

## Modelo de penalizacion
La penalizacion al transportista aplica solo cuando la causa raiz del incumplimiento
es atribuible al transportista (determinado en N2/N3). No se penaliza por causas de
fuerza mayor ni por datos de destino erroneos del cliente.

## Evaluacion trimestral: criterios
| Criterio | Peso |
|----------|------|
| Cumplimiento de SLA (politica vigente) | 50% |
| Tasa de incidencias | 30% |
| Costo | 20% |

> La evaluacion usa la politica de SLA vigente al cierre del trimestre, no el
> umbral historico.

## Escenario
Un lote de envios de RutaMaya al sureste excede el SLA. N2 analiza causa raiz: si es
atribuible al transportista, aplica penalizacion; si es fuerza mayor, no.
