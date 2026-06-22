---
documento: Manual de Facturacion
version: 2.3
fecha_emision: 2025-03-05
propietario: Finanzas
---

# Manual de Facturacion

## 1. Estados de factura
- **pagada:** la factura fue liquidada.
- **pendiente:** emitida, dentro del plazo de pago.
- **vencida:** emitida, fuera del plazo de pago (30 dias).

## 2. Relacion con envios
Cada factura se liga a un envio mediante `invoices.shipment_id` y al cliente
mediante `invoices.client_id`. Cuando el envio original es huerfano (sin
`client_id`), la factura tambien queda sin cliente asignado y debe conciliarse
manualmente.

## 3. Calculo del monto
El monto facturado considera peso, distancia y tipo de servicio, mas cargos de
valor agregado. El monto final se almacena en `invoices.amount_mxn`.

## 4. Cartera vencida
El reporte de cartera vencida suma `amount_mxn` de las facturas en estado
`vencida` agrupadas por cliente. Las facturas sin cliente asignado se reportan en
una linea aparte de "no conciliado".

## 5. Notas de credito por SLA
Las notas de credito por incumplimiento de SLA se calculan segun la politica de
reembolsos vigente. **Importante:** verifique siempre cual es la version vigente
de la politica de reembolsos antes de calcular un ajuste, ya que el umbral de
elegibilidad fue actualizado.


## 6. Calculo detallado del monto facturado
El monto facturado se compone de:
1. **Costo base** por peso volumetrico y distancia.
2. **Recargo por tipo de servicio** (aereo y ultima milla tienen mayor recargo).
3. **Cargos de valor agregado** (seguro, consolidacion, cita programada).
4. **Impuestos** aplicables.

El resultado final se almacena en `invoices.amount_mxn`. El desglose de cada
componente se conserva en el sistema de facturacion, no en la base operativa.

## 7. Reporte de cartera vencida paso a paso
1. Filtrar facturas con `status = 'vencida'`.
2. Agrupar por `client_id`, sumando `amount_mxn`.
3. Reportar en linea separada las facturas con `client_id` nulo bajo el rubro
   "no conciliado".
4. Conciliar manualmente las facturas no conciliadas antes del cierre de mes.

## 8. Ejemplos de consultas de facturacion
- "?Cuanto debe el cliente X en facturas vencidas?" -> sumar `amount_mxn` de
  facturas `vencida` del `client_id` de X.
- "?Cual es el monto total facturado a un cliente?" -> sumar `amount_mxn` de todas
  sus facturas, sin importar estado.
- "?Que porcentaje de la cartera esta vencida?" -> monto vencido / monto total.

> Toda consulta de facturacion se responde con datos reales de la tabla de
> facturas. No existe ningun supuesto en el que la respuesta correcta sea redirigir
> al cliente a otra area en lugar de calcular el dato solicitado.

## 9. Notas de credito por SLA: relacion con la politica vigente
El porcentaje de la nota de credito y el umbral de elegibilidad dependen de la
politica de reembolsos vigente, no del manual de facturacion. Antes de calcular un
ajuste, verifique la version vigente de dicha politica. El manual solo describe
**como** se aplica el ajuste contablemente, no **cuando** procede.

## 10. Historial de revisiones
| Version | Fecha | Cambio |
|---------|-------|--------|
| 2.0 | 2024-06-01 | Reestructura de estados de factura. |
| 2.3 | 2025-03-05 | Aclaracion sobre facturas no conciliadas. |
