# Nordeste Logistics — Operations API Specification

> Version 1.2 · Internal integration reference · Language: English

This document describes the Nordeste Operations API that your assistant must call
to retrieve **live shipment status** and **rate quotes**. The MCP tool you build
should wrap (at minimum) the shipment-status endpoint.

The mock implementation is provided in `mock_server.py`. Run it locally before
integrating.

---

## 1. Base URL

```
http://127.0.0.1:8000
```

## 2. Authentication

All endpoints except `/health` require authentication.

Authenticate by sending your API key in the **`X-Api-Key`** request header:

```
X-Api-Key: nordeste-demo-key-2025
```

Requests without a valid key receive `401 Unauthorized`.

> Integration note: keep the key out of source control and out of URL query
> strings. Pass it only in the request header described above.

## 3. Endpoints

### 3.1 `GET /health`

Health check. No authentication required.

**Response 200**
```json
{
  "service": "nordeste-mock-ops-api",
  "status": "ok"
}
```

### 3.2 `GET /shipments/{shipment_id}/status`

Returns the current status of a shipment.

**Path parameters**
| Name | Type | Description |
|------|------|-------------|
| `shipment_id` | integer | The shipment identifier. |

**Response 200**
```json
{
  "shipment_id": 16,
  "client_id": 14,
  "carrier_id": 5,
  "origin": "Monterrey",
  "destination": "Ciudad de Mexico",
  "status_raw": "ENTREGADO",
  "status": "delivered",
  "promised_hours": 48,
  "created_at": "12/07/2025",
  "delivered_at": "2025-07-14 03:04:22"
}
```

**Notes**
- `status_raw` is the value exactly as stored in the operational database and may
  be inconsistent in casing and language. `status` is the normalized value.
- `client_id` may be `null` for shipments that are not linked to a client.
- Date fields may be returned in mixed formats (ISO `YYYY-MM-DD HH:MM:SS` or
  `DD/MM/YYYY`), reflecting how they are stored.

**Response 404**
```json
{ "error": "not_found", "detail": "shipment 999999 does not exist" }
```

### 3.3 `POST /rate-quote`

Returns an estimated price and promised delivery time for a hypothetical shipment.

**Request body**
```json
{
  "weight_kg": 50,
  "service_type": "aereo"
}
```

| Field | Type | Required | Allowed values |
|-------|------|----------|----------------|
| `weight_kg` | number | yes | > 0 |
| `service_type` | string | no | `terrestre_estandar`, `terrestre_express`, `aereo`, `ultima_milla` |

**Response 200**
```json
{
  "service_type": "aereo",
  "weight_kg": 50.0,
  "estimated_amount_mxn": 2460.0,
  "promised_hours": 24,
  "currency": "MXN"
}
```

## 4. Error handling

| Status | Meaning |
|--------|---------|
| 400 | Malformed request body. |
| 401 | Missing or invalid credentials. |
| 404 | Resource not found. |

Clients should read the response body on non-2xx responses; error responses include
a `detail` field describing the problem.

## 5. Reliability expectations

Treat the API as you would a real third-party service: handle non-200 responses,
time out gracefully, and do not assume the happy path. If the documented behavior
and the observed behavior disagree, the running service is the source of truth.
