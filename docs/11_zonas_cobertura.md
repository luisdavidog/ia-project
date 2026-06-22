---
documento: Zonas de Cobertura
version: 1.0
fecha_emision: 2024-03-01
propietario: Comercial
---

# Zonas de Cobertura

## Corredor principal
El corredor noreste (Monterrey - Saltillo) concentra el mayor volumen y los mejores
tiempos de entrega.

## Zonas
- **Zona A (premium):** Monterrey, Saltillo. SLA mas agresivo, mayor frecuencia.
- **Zona B (estandar):** Guadalajara, Queretaro, Leon, Toluca, Puebla, Ciudad de
  Mexico. Cobertura diaria.
- **Zona C (extendida):** Tijuana, Merida. Frecuencia menor, mayor variabilidad de
  tiempos.

## Consideraciones
Los tiempos comprometidos varian por zona. Un mismo tipo de servicio puede tener
distinto `promised_hours` segun origen y destino. Las rutas hacia Zona C (en
particular Merida y Tijuana) presentan mayor dispersion en `actual_hours`.


## Detalle por zona
### Zona A - premium
Monterrey y Saltillo. Mayor frecuencia, mejores tiempos, SLA mas agresivo. Es el
nucleo de la operacion y concentra el mayor volumen.

### Zona B - estandar
Guadalajara, Queretaro, Leon, Toluca, Puebla y Ciudad de Mexico. Cobertura diaria,
tiempos predecibles.

### Zona C - extendida
Tijuana y Merida. Menor frecuencia, mayor variabilidad de `actual_hours`. Las rutas
a Merida concentran la mayor dispersion de tiempos de toda la red.

## Tabla de referencia origen-destino
| Origen | Destino | Zona destino | Variabilidad esperada |
|--------|---------|--------------|-----------------------|
| Monterrey | Saltillo | A | Baja |
| Monterrey | Ciudad de Mexico | B | Media |
| Monterrey | Merida | C | Alta |
| Guadalajara | Tijuana | C | Alta |

## Implicacion para SLA
El `promised_hours` de un envio depende de la zona destino. Un analisis de
cumplimiento por zona debe segmentar por destino, no agregar todas las rutas en un
solo promedio que oculte la variabilidad de Zona C.

## Nota de planeacion
Para envios a Zona C se recomienda holgura adicional en la promesa de entrega y, en
clientes enterprise, comunicar explicitamente la mayor variabilidad.
