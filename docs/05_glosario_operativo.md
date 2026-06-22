---
documento: Glosario Operativo
version: 1.2
fecha_emision: 2024-05-15
propietario: Operaciones
---

# Glosario Operativo

- **SLA (Service Level Agreement):** compromiso de tiempo de entrega, en horas.
- **promised_hours:** horas comprometidas para un envio.
- **actual_hours:** horas reales que tardo la entrega.
- **breach / incumplimiento:** cuando el tiempo real supera el umbral definido por
  la politica de SLA vigente.
- **client_id:** identificador del cliente. Puede estar ausente en envios capturados
  por canales que aun no integran el catalogo de clientes (envios "huerfanos").
- **envio huerfano:** envio sin `client_id` asignado. Representa una porcion no
  trivial del historico y debe tratarse explicitamente en cualquier analisis por
  cliente.
- **carrier / transportista:** empresa que ejecuta fisicamente el transporte.
- **nota de credito:** ajuste a favor del cliente por incumplimiento de SLA.
- **logistica inversa:** proceso de devolucion de mercancia.
- **estatus de envio:** estado del envio. Historicamente capturado con valores
  inconsistentes (mayusculas/minusculas, espanol/ingles). Normalizar antes de
  agrupar.


## Terminos de datos y calidad
- **formato de fecha mezclado:** el historico contiene fechas en formato ISO
  (AAAA-MM-DD) y en formato DD/MM/AAAA como texto. Cualquier calculo temporal debe
  normalizar ambos formatos.
- **normalizacion de estatus:** proceso de mapear las variantes de estatus a un
  conjunto canonico. Por ejemplo: {delivered, Delivered, DELIVERED, Entregado,
  ENTREGADO, entregado} -> "entregado".
- **INNER JOIN ingenuo:** union que descarta filas sin coincidencia. Sobre
  `shipments` con `client_id` nulo, descarta en silencio los envios huerfanos y
  subcuenta totales por cliente.
- **ground truth:** valor correcto de referencia contra el cual se evalua una
  respuesta del sistema.

## Terminos comerciales
- **segmento:** clasificacion del cliente (`enterprise`, `pyme`, `gobierno`).
- **cartera vencida:** monto de facturas en estado `vencida`.
- **ciclo de facturacion:** periodicidad con la que se emiten facturas a un cliente.

## Terminos de SLA
- **promised_hours:** compromiso de tiempo del envio.
- **actual_hours:** tiempo real de entrega.
- **umbral de incumplimiento:** holgura permitida sobre el compromiso antes de que
  exista incumplimiento. Definido por la politica de reembolsos vigente.
- **breached_flag:** marca historica de incumplimiento en la base. Calculada con una
  regla anterior; puede no coincidir con la politica vigente.

## Nota de uso
Este glosario es la referencia canonica de terminologia. Ante cualquier ambiguedad
en otros documentos, los terminos aqui definidos prevalecen para efectos de
interpretacion operativa, salvo en lo relativo a umbrales de SLA, que se rigen
siempre por la politica de reembolsos vigente.
