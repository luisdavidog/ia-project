---
documento: Catalogo de Servicios
version: 3.1
fecha_emision: 2025-01-20
propietario: Comercial
---

# Catalogo de Servicios

## Servicios de transporte
- **Terrestre estandar:** rutas nacionales, SLA tipico 72-96 h. Transportistas:
  TransNorte, Fletes Bravo, RutaMaya Cargo.
- **Terrestre express:** rutas prioritarias, SLA tipico 48 h.
- **Aereo:** mercancia urgente o de alto valor, SLA tipico 24 h. Transportista:
  AeroCarga MX.
- **Ultima milla:** entrega final en zona metropolitana, SLA 24 h. Transportista:
  UltimaMilla Express.

## Servicios de valor agregado
- Rastreo en tiempo real.
- Seguro de mercancia (opcional, sobre el valor declarado).
- Consolidacion de carga.
- Cita de entrega programada.

## Cobertura
Cobertura nacional con foco en el corredor noreste (Monterrey, Saltillo) y
conexiones a Bajio, occidente y centro del pais. Ver documento de zonas de
cobertura para detalle.

## Tarifas
Las tarifas se calculan por peso volumetrico, distancia y tipo de servicio. El
monto facturado de cada envio queda en `invoices.amount_mxn`. Consulte el manual
de facturacion para el detalle del calculo.


## Detalle de niveles de servicio
### Terrestre estandar
Servicio base para carga general en rutas nacionales. SLA tipico de 72 a 96 horas
segun zona. Recomendado para mercancia no perecedera y sin urgencia. Transportistas
asignables: TransNorte, Fletes Bravo, RutaMaya Cargo.

### Terrestre express
Rutas prioritarias con SLA tipico de 48 horas. Mayor costo por kilogramo. Sujeto a
disponibilidad de cupo en las rutas premium del corredor noreste.

### Aereo
Para mercancia urgente o de alto valor. SLA tipico de 24 horas. Unico transportista
aereo: AeroCarga MX. Aplica seguro obligatorio sobre el valor declarado por encima
de cierto umbral.

### Ultima milla
Entrega final en zona metropolitana, SLA de 24 horas. Transportista: UltimaMilla
Express. Soporta cita de entrega programada y reintentos.

## Combinaciones de servicio
Un mismo envio puede combinar tramos (por ejemplo, aereo + ultima milla). En esos
casos, el `promised_hours` refleja el compromiso de extremo a extremo, no el de cada
tramo por separado.

## Valor agregado: detalle
- **Rastreo en tiempo real:** disponible para todos los servicios.
- **Seguro de mercancia:** prima sobre valor declarado.
- **Consolidacion de carga:** optimiza costo para envios pequenos al mismo destino.
- **Cita programada:** coordina ventana de entrega con el destinatario.

## Tabla de referencia de SLA por tipo de servicio
| Servicio | SLA tipico (h) | Transportistas |
|----------|----------------|----------------|
| Terrestre estandar | 72-96 | TransNorte, Fletes Bravo, RutaMaya |
| Terrestre express | 48 | TransNorte, Fletes Bravo |
| Aereo | 24 | AeroCarga MX |
| Ultima milla | 24 | UltimaMilla Express |

> El SLA real de cada envio se fija al crearlo y se guarda en `promised_hours`.
