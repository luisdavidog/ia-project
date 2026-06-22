---
documento: Acuerdo de Nivel de Servicio (SLA) - Operaciones de Transporte
version: 1.0
fecha_emision: 2023-06-01
estado: VIGENTE
propietario: Direccion de Operaciones
---

# Acuerdo de Nivel de Servicio (SLA) v1.0

## 1. Proposito
Este documento define los compromisos de tiempo de entrega que Nordeste Logistica
ofrece a sus clientes, los mecanismos de medicion y las compensaciones aplicables
cuando dichos compromisos no se cumplen.

## 2. Tiempos de entrega comprometidos
Los tiempos comprometidos (SLA) se establecen por tipo de servicio al momento de
generar el envio y quedan registrados en el campo `promised_hours` de cada envio.
Los valores estandar son 24, 48, 72 y 96 horas segun la ruta y el servicio
contratado.

El "tiempo real de entrega" es el numero de horas transcurridas entre la creacion
del envio y su entrega efectiva, registrado en `sla_events.actual_hours`.

## 3. Incumplimiento y compensacion
Se considera que existe **incumplimiento de SLA** cuando el tiempo real de entrega
**excede en mas de 48 horas** el tiempo comprometido para ese envio.

Cuando se confirma un incumplimiento, el cliente tiene derecho a una **nota de
credito equivalente al 15%** del monto facturado del envio afectado. La nota de
credito se aplica automaticamente en el siguiente ciclo de facturacion.

> Regla operativa: `incumplimiento = actual_hours > (promised_hours + 48)`

## 4. Exclusiones
No se consideran incumplimientos los retrasos derivados de:
- Caso fortuito o fuerza mayor (fenomenos meteorologicos, bloqueos carreteros).
- Datos de destino incorrectos proporcionados por el cliente.
- Envios en estado `cancelled` / `cancelado`.

## 5. Medicion y reporte
El area de Operaciones genera un reporte mensual de cumplimiento de SLA. El campo
`sla_events.breached_flag` indica si el envio incumplio segun la regla vigente al
momento del registro.

## 6. Vigencia
Este acuerdo entra en vigor el 1 de junio de 2023 y permanece vigente hasta que
sea reemplazado por una version posterior debidamente publicada.


## 7. Metodologia de medicion detallada
La medicion del cumplimiento se realiza envio por envio. Para cada envio entregado
se obtiene `actual_hours` desde el registro de eventos de SLA y se compara contra
`promised_hours`. El area de Operaciones consolida estos resultados en un tablero
semanal segmentado por transportista, zona de cobertura y tipo de servicio.

### 7.1 Reglas de redondeo
Los tiempos se miden en horas con un decimal. Para efectos de elegibilidad de
compensacion, no se aplica redondeo hacia abajo: un envio con `actual_hours` de
48.1 horas por encima del comprometido se considera incumplimiento bajo esta
version del acuerdo.

### 7.2 Ventanas de no laborable
Bajo la version 1.0, los fines de semana y dias feriados oficiales se descuentan
del computo de horas para envios terrestres estandar, pero NO para envios aereos ni
de ultima milla, que operan en tiempo continuo. Esta distincion genero confusion
historica y fue una de las razones de la revision posterior de la politica.

## 8. Escenarios de referencia (version 1.0)
- **Escenario A:** envio terrestre con `promised_hours` = 72, entregado en 118
  horas. Exceso = 46 horas. Bajo v1.0 (umbral 48) **no** hay incumplimiento.
- **Escenario B:** envio aereo con `promised_hours` = 24, entregado en 80 horas.
  Exceso = 56 horas. Bajo v1.0 **si** hay incumplimiento; nota de credito del 15%.
- **Escenario C:** envio express con `promised_hours` = 48, entregado en 95 horas.
  Exceso = 47 horas. Bajo v1.0 **no** hay incumplimiento (queda por debajo de 48).

> Estos escenarios ilustran la regla de la version 1.0. La elegibilidad cambia bajo
> versiones posteriores de la politica de compensacion.

## 9. Responsabilidades
- **Operaciones:** medir, consolidar y reportar el cumplimiento.
- **Finanzas:** aplicar las notas de credito aprobadas.
- **Comercial:** comunicar al cliente los compromisos y, en su caso, las
  compensaciones.

## 10. Historial de revisiones
| Version | Fecha | Cambio |
|---------|-------|--------|
| 1.0 | 2023-06-01 | Emision inicial. Umbral de incumplimiento: 48 horas. |
