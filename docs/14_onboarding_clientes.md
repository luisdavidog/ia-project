---
documento: Guia de Onboarding de Clientes
version: 1.3
fecha_emision: 2024-12-05
propietario: Comercial
---

# Onboarding de Clientes

## 1. Alta de cliente
El cliente se da de alta en el catalogo con su `client_id`, segmento
(`enterprise`, `pyme`, `gobierno`) y ciudad. A partir del alta, sus envios deben
quedar ligados a su `client_id`.

## 2. Definicion de SLA por contrato
Durante el onboarding se acuerdan los tiempos comprometidos por tipo de servicio.
Estos se reflejan en `promised_hours` de cada envio.

## 3. Reglas de facturacion
Se define el ciclo de facturacion y el plazo de pago (estandar 30 dias). Clientes
`enterprise` pueden tener condiciones especiales.

## 4. Expectativas de servicio
Se comunica al cliente la politica de SLA y de reembolsos **vigente**, no versiones
historicas. Verifique siempre cual es la version actual antes de comprometer
condiciones.


## 5. Checklist de onboarding
1. Alta del cliente en el catalogo con `client_id`, segmento y ciudad.
2. Definicion de SLA por tipo de servicio (se reflejan en `promised_hours`).
3. Configuracion del ciclo de facturacion y plazo de pago.
4. Comunicacion de la politica de SLA y reembolsos **vigente**.
5. Asignacion de gerente de cuenta para clientes enterprise.

## 6. Integracion de datos del cliente
Idealmente, todos los envios del cliente quedan ligados a su `client_id` desde el
primer dia. En la practica, algunos canales historicos generaron envios sin cliente
(huerfanos). Durante el onboarding se acuerda un plan de conciliacion para minimizar
estos casos a futuro.

## 7. Expectativas de servicio por segmento
- **enterprise:** canal prioritario, compensaciones reforzadas segun politica
  vigente, gerente de cuenta dedicado.
- **pyme:** servicio estandar, mesa de servicio 24/7.
- **gobierno:** condiciones segun contrato y normativa aplicable.

## 8. Errores comunes en onboarding
- Comunicar al cliente un umbral de SLA de una version anterior de la politica.
- No definir el manejo de envios huerfanos del historico del cliente.
- Omitir la asignacion de gerente de cuenta a un cliente enterprise.

## 9. Cierre de onboarding
El onboarding se considera completo cuando el cliente tiene SLA definido, ciclo de
facturacion configurado y al menos un envio de prueba conciliado correctamente a su
`client_id`.
