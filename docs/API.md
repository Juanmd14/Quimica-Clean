# API — Química Clean

Todos los endpoints viven bajo `/api`. Las respuestas exitosas siguen el shape `{ success: true, data }`. Los errores devuelven `{ error: string, details?: string }` con código HTTP correspondiente.

Los endpoints marcados como **admin** requieren la cookie `admin_session` (httpOnly, válida 24h, emitida por `POST /api/admin/login`).

---

## Productos

### `GET /api/products`
Lista productos. Cacheado con `revalidate = 600`. Ordena con prioridad a la categoría `Jabones` y a productos featured (`ariel nelson`, `ala nelson`).

**Query params:**
- `category` *(opcional)* — filtra por categoría.
- `all=true` *(opcional)* — incluye productos con `activo = false`. Por defecto sólo activos.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "nombre": "Detergente 10%",
      "categoria": "Detergentes",
      "descripcion": "...",
      "color": "#f9a825",
      "color2": null,
      "emoji": null,
      "imagen_url": "https://....supabase.co/storage/v1/...",
      "activo": true,
      "orden": 0
    }
  ]
}
```

### `GET /api/products/:id`
Devuelve un producto.

### `POST /api/products` *(admin)*
Crea un producto.

**Body:**
```json
{
  "nombre": "Detergente 10%",
  "categoria": "Detergentes",
  "descripcion": "Limpiador efectivo",
  "color": "#f9a825",
  "color2": null,
  "emoji": null,
  "imagen_url": "https://....supabase.co/storage/v1/...",
  "activo": true,
  "orden": 0
}
```
`nombre` y `categoria` son obligatorios.

### `PUT /api/products/:id` *(admin)*
Actualiza los campos enviados (whitelist: `nombre`, `categoria`, `descripcion`, `color`, `color2`, `emoji`, `imagen_url`, `activo`, `orden`).

### `DELETE /api/products/:id` *(admin)*

### `POST /api/products/upload` *(admin)*
Sube una imagen al bucket `productos` de Supabase Storage.

**Body:** `multipart/form-data` con campo `file`.

**Respuesta:**
```json
{ "url": "https://....supabase.co/storage/v1/object/public/productos/<filename>" }
```

---

## Categorías

### `GET /api/categorias`
Público. Cacheado con `revalidate = 3600`.

### `POST /api/categorias` *(admin)*
Body: `{ nombre, emoji?, orden? }`.

### `PUT /api/categorias` *(admin)*
Body: `{ id, emoji?, imagen_url?, orden? }`.

---

## Leads

### `POST /api/leads`
Público. Guarda el lead en la tabla `leads` y, si hay `RESEND_API_KEY`, envía un email de notificación al admin (no bloquea la respuesta si falla).

**Body:**
```json
{
  "nombre": "Juan",
  "telefono": "+5493811234567",
  "producto_interes": "Detergente 10%",
  "mensaje": "Quiero presupuesto por 200 L"
}
```

**Validaciones**: `nombre` y `telefono` obligatorios, máximos de longitud, anti-spam por caracteres repetidos.

---

## Admin auth

### `POST /api/admin/login`
Body: `{ password: string }`. Si coincide con `ADMIN_PASSWORD`, emite la cookie `admin_session` (httpOnly, sameSite=strict, 24h).

### `POST /api/admin/logout`
Limpia la cookie.

### `GET /api/admin/session`
Devuelve `{ authenticated: boolean }`.

---

## Códigos HTTP

| Código | Significado |
|---|---|
| 200 | Éxito (GET/PUT/DELETE) |
| 201 | Creado (POST) |
| 400 | Body inválido |
| 401 | No autenticado como admin |
| 404 | No encontrado |
| 500 | Error del servidor |
