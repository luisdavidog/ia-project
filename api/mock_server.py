#!/usr/bin/env python3
"""
Nordeste Logistics - Mock Operations API
=========================================
Servidor mock para la prueba tecnica. Lee del SQLite operativo para devolver
estatus reales de envios y cotizaciones sinteticas.

TRAMPA PLANTADA (T-AUTH):
  El API_SPEC.md documenta el header de auth como 'X-Api-Key'.
  Este servidor NO acepta ese header. Exige 'Authorization: Bearer <token>'.
  Seguir el spec al pie de la letra produce 401. El cuerpo del 401 revela el
  header correcto. El candidato debe depurar desde la realidad, no desde el doc.

Uso:
    pip install flask
    python mock_server.py
    # corre en http://127.0.0.1:8000

Token valido (el mismo que aparece en el spec):
    nordeste-demo-key-2025
"""
import sqlite3
import os
from flask import Flask, request, jsonify

APP = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "nordeste_ops.sqlite")
DB_PATH = os.path.abspath(DB_PATH)

VALID_TOKEN = "nordeste-demo-key-2025"

# mapeo de variantes de estatus a forma canonica (la API SI normaliza al exponer)
STATUS_CANON = {
    "delivered": "delivered", "entregado": "delivered",
    "in_transit": "in_transit", "in transit": "in_transit", "en_transito": "in_transit",
    "en transito": "in_transit",
    "pending": "pending", "pendiente": "pending",
    "cancelled": "cancelled", "cancelado": "cancelled",
}


def canon_status(raw):
    if raw is None:
        return None
    return STATUS_CANON.get(raw.strip().lower(), raw.strip().lower())


def check_auth():
    """
    Verifica 'Authorization: Bearer <token>'.
    Devuelve None si OK, o una tupla (response, status_code) si falla.
    NOTA: rechaza explicitamente X-Api-Key para dejar una pista clara en el 401.
    """
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth.split(" ", 1)[1].strip()
        if token == VALID_TOKEN:
            return None
        return (jsonify({
            "error": "unauthorized",
            "detail": "Invalid bearer token.",
            "expected_header": "Authorization: Bearer <token>"
        }), 401)

    # pista de depuracion: si mandaron X-Api-Key (como dice el spec), explicar el error
    if request.headers.get("X-Api-Key") is not None:
        return (jsonify({
            "error": "unauthorized",
            "detail": ("Authentication via 'X-Api-Key' is NOT supported by this API. "
                       "This service authenticates with an 'Authorization: Bearer <token>' "
                       "header. Please resend the request using the Bearer scheme."),
            "expected_header": "Authorization: Bearer <token>",
            "received_header": "X-Api-Key"
        }), 401)

    return (jsonify({
        "error": "unauthorized",
        "detail": ("Missing credentials. This API expects an "
                   "'Authorization: Bearer <token>' header."),
        "expected_header": "Authorization: Bearer <token>"
    }), 401)


@APP.route("/health", methods=["GET"])
def health():
    """Sin auth. Util para verificar que el servicio esta arriba."""
    return jsonify({
        "service": "nordeste-mock-ops-api",
        "status": "ok",
        "auth": "Authorization: Bearer <token>",
        "endpoints": ["/health", "/shipments/<id>/status", "/rate-quote"]
    })


@APP.route("/shipments/<int:shipment_id>/status", methods=["GET"])
def shipment_status(shipment_id):
    auth_err = check_auth()
    if auth_err is not None:
        return auth_err

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    row = cur.execute(
        "SELECT shipment_id, client_id, carrier_id, origin, destination, "
        "status, promised_hours, created_at, delivered_at "
        "FROM shipments WHERE shipment_id = ?", (shipment_id,)
    ).fetchone()
    con.close()

    if row is None:
        return jsonify({"error": "not_found",
                        "detail": f"shipment {shipment_id} does not exist"}), 404

    return jsonify({
        "shipment_id": row[0],
        "client_id": row[1],            # OJO: puede ser null (envio huerfano)
        "carrier_id": row[2],
        "origin": row[3],
        "destination": row[4],
        "status_raw": row[5],           # como esta en la base (inconsistente)
        "status": canon_status(row[5]), # normalizado por la API
        "promised_hours": row[6],
        "created_at": row[7],           # OJO: formato puede ser ISO o DD/MM/YYYY
        "delivered_at": row[8]
    })


@APP.route("/rate-quote", methods=["POST"])
def rate_quote():
    auth_err = check_auth()
    if auth_err is not None:
        return auth_err

    data = request.get_json(silent=True) or {}
    try:
        weight = float(data["weight_kg"])
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "bad_request",
                        "detail": "weight_kg (number) is required"}), 400

    service = str(data.get("service_type", "terrestre_estandar")).lower()
    # recargo sintetico por tipo de servicio
    multiplier = {
        "terrestre_estandar": 1.0,
        "terrestre_express": 1.4,
        "aereo": 2.6,
        "ultima_milla": 1.2,
    }.get(service, 1.0)
    promised = {
        "terrestre_estandar": 84,
        "terrestre_express": 48,
        "aereo": 24,
        "ultima_milla": 24,
    }.get(service, 84)

    base = weight * 18.0 * multiplier + 120.0
    return jsonify({
        "service_type": service,
        "weight_kg": weight,
        "estimated_amount_mxn": round(base, 2),
        "promised_hours": promised,
        "currency": "MXN"
    })


if __name__ == "__main__":
    if not os.path.exists(DB_PATH):
        print(f"[WARN] No se encontro la base en {DB_PATH}. "
              f"Genere primero la base operativa.")
    print("Nordeste Mock Ops API")
    print("Auth real: Authorization: Bearer nordeste-demo-key-2025")
    print("Escuchando en http://127.0.0.1:8000")
    APP.run(host="127.0.0.1", port=8000, debug=False)
