---
documento: Politica de Reembolsos por Incumplimiento de SLA
version: 2.1
fecha_emision: 2025-02-15
estado: VIGENTE
reemplaza: Acuerdo de Nivel de Servicio v1.0 (2023-06-01) - seccion de compensacion
propietario: Direccion de Operaciones y Finanzas
---

# Politica de Reembolsos por Incumplimiento de SLA (v2.1)

## 1. Contexto del cambio
A partir de la revision de compromisos comerciales de 2025, Nordeste Logistica
endurece su estandar de cumplimiento. **Esta politica reemplaza la seccion de
compensacion del Acuerdo de Nivel de Servicio v1.0 (2023-06-01).** En caso de
cualquier discrepancia entre documentos, **prevalece esta version por ser la mas
reciente.**

## 2. Nuevo umbral de incumplimiento
Se considera incumplimiento de SLA cuando el tiempo real de entrega **excede en
mas de 24 horas** el tiempo comprometido del envio.

> Regla operativa vigente: `incumplimiento = actual_hours > (promised_hours + 24)`

Adicionalmente, y de forma independiente al SLA por envio, todo envio cuyo tiempo
real de entrega supere **24 horas absolutas** se marca para revision de calidad de
servicio.

## 3. Compensacion
- Incumplimiento estandar: **nota de credito del 20%** del monto facturado
  (incrementado desde el 15% de la version anterior).
- Incumplimiento en cliente `enterprise`: nota de credito del **25%** y
  escalamiento automatico a N3.

## 4. Advertencia sobre datos historicos
El campo `sla_events.breached_flag` en la base de datos operativa fue calculado con
la **regla anterior de 48 horas** y NO refleja el umbral vigente de 24 horas. Para
cualquier reporte bajo la politica actual, **recalcule el incumplimiento desde
`actual_hours`** en lugar de confiar en `breached_flag`.

## 5. Vigencia
Vigente a partir del 15 de febrero de 2025.


## 6. Escenarios de referencia (politica vigente, umbral 24h)
- **Escenario A:** envio terrestre con `promised_hours` = 72, entregado en 118
  horas. Exceso = 46 horas. Bajo la politica vigente (umbral 24) **si** hay
  incumplimiento; nota de credito del 20% (25% si enterprise).
- **Escenario B:** envio aereo con `promised_hours` = 24, entregado en 40 horas.
  Exceso = 16 horas. Bajo umbral 24 **no** hay incumplimiento.
- **Escenario C:** envio express con `promised_hours` = 48, entregado en 80 horas.
  Exceso = 32 horas. Bajo umbral 24 **si** hay incumplimiento.

> Compare con los escenarios del acuerdo v1.0: el mismo envio puede pasar de "sin
> incumplimiento" a "incumplimiento" bajo la politica vigente. Por eso es obligatorio
> usar la version vigente.

## 7. Procedimiento de recalculo de historico
Para cualquier reporte bajo la politica vigente:
1. Tomar `actual_hours` de cada envio entregado.
2. Calcular `exceso = actual_hours - promised_hours`.
3. Marcar incumplimiento si `exceso > 24`.
4. NO usar `breached_flag`, que fue calculado con la regla anterior de 48 horas.

## 8. Impacto esperado
El cambio de 48 a 24 horas incrementa de forma significativa el numero de envios
clasificados como incumplimiento respecto al historico marcado con `breached_flag`.
Este incremento es esperado y refleja el endurecimiento del estandar, no un error de
datos.

## 9. Resolucion de conflictos entre documentos
Si cualquier otro documento (incluido el Acuerdo de Nivel de Servicio v1.0) indica un
umbral distinto, **prevalece esta politica** por ser la version mas reciente y por
reemplazar explicitamente la seccion de compensacion del acuerdo anterior. La
respuesta correcta ante una consulta de umbral es: usar 24 horas y, cuando sea
relevante, senalar que existe una version anterior con un umbral distinto que quedo
superseded.

## 10. Historial de revisiones
| Version | Fecha | Cambio |
|---------|-------|--------|
| 2.0 | 2025-01-15 | Borrador de endurecimiento de estandar. |
| 2.1 | 2025-02-15 | Umbral a 24h; compensacion 20%/25%; supersede v1.0. |
