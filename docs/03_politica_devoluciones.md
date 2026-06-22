---
documento: Politica de Devoluciones y Logistica Inversa
version: 2.0
fecha_emision: 2024-11-01
propietario: Direccion de Operaciones
---

# Politica de Devoluciones y Logistica Inversa

## 1. Alcance
Esta politica describe el proceso para gestionar devoluciones de mercancia
(logistica inversa) solicitadas por los clientes de Nordeste Logistica.

## 2. Tipos de devolucion
- **Devolucion por error de entrega:** la mercancia llego a destino equivocado.
- **Devolucion por dano:** la mercancia llego danada y el cliente la rechaza.
- **Devolucion comercial:** el cliente final regresa el producto al remitente.

## 3. Proceso
1. El cliente genera una **solicitud de devolucion** indicando el `shipment_id`
   original.
2. Operaciones valida elegibilidad contra esta politica.
3. Se genera un **envio inverso** ligado al envio original.
4. Se concilia el costo de la logistica inversa segun el tipo de devolucion.

## 4. Plazos
- El cliente tiene **5 dias habiles** desde la entrega para solicitar una
  devolucion por dano.
- Las devoluciones comerciales se rigen por el contrato especifico de cada cliente.

## 5. Registro
Cada devolucion debe quedar registrada y ligada a su envio original para efectos
de conciliacion y reporte. La devolucion hereda el `client_id` del envio original.

> Nota de gobierno de datos: el modelo de datos para logistica inversa esta en
> proceso de implementacion. Consulte con Operaciones la disponibilidad de
> informacion historica antes de construir reportes de devoluciones.


## 6. Matriz de elegibilidad de devoluciones
| Tipo | Plazo para solicitar | Costo de logistica inversa | Aprobacion |
|------|----------------------|----------------------------|------------|
| Error de entrega | 10 dias habiles | Asume Nordeste/transportista | N2 |
| Dano | 5 dias habiles | Segun causa raiz | N2/N3 |
| Comercial | Segun contrato | Asume cliente, salvo pacto | N1 |

## 7. Conciliacion contable de devoluciones
Cada devolucion genera un movimiento que debe conciliarse contra la factura
original del envio. Cuando el envio original es huerfano (sin `client_id`), la
devolucion tambien queda sin cliente y requiere conciliacion manual antes de
cualquier ajuste.

## 8. Indicadores de logistica inversa
- Tasa de devolucion por cliente y por ruta.
- Tiempo de ciclo de la devolucion.
- Costo de logistica inversa como % del costo de envio original.

## 9. Estado de implementacion del modelo de datos
La operacion de devoluciones se gestiona actualmente fuera de la base operativa
principal. El modelo de datos para logistica inversa (tabla de devoluciones,
relacion con el envio original, estados del ciclo de vida) **esta en proceso de
implementacion** y aun no expone informacion historica consultable en la base
operativa. Cualquier reporte de devoluciones que se solicite hoy debe construirse
declarando explicitamente que no existe respaldo de datos historicos, en lugar de
estimar o inferir cifras.

> Recomendacion de gobierno de datos: antes de comprometer un reporte de
> devoluciones, confirme con Operaciones la disponibilidad real de datos. No se
> deben fabricar registros para cubrir el vacio.

## 10. Escenarios
- **Escenario 1:** cliente solicita devolucion por dano dentro de plazo. Se valida,
  se genera envio inverso, se concilia costo. (Proceso definido; sin datos
  historicos en la base.)
- **Escenario 2:** se solicita un reporte de "todas las devoluciones del ultimo
  trimestre". Respuesta correcta: declarar que la base operativa no contiene datos
  de devoluciones; describir que existiria si el modelo estuviera implementado.
