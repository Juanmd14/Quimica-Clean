# API de Productos - Documentación

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. GET /products
Lista todos los productos con opciones de filtrado y paginación.

**Parámetros Query:**
- `category` (opcional): Filtrar por categoría
- `limit` (opcional, default: 50): Número de productos a retornar
- `offset` (opcional, default: 0): Número de productos a saltar

**Ejemplo:**
```bash
GET /api/products?category=Limpiadores&limit=10&offset=0
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Limpiador Multiusos",
      "description": "Limpiador efectivo...",
      "price": 299.99,
      "category": "Limpiadores",
      "image_url": "https://...",
      "stock": 50,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

---

### 2. GET /products/:id
Obtiene un producto específico por su ID.

**Parámetros:**
- `id` (obligatorio): ID del producto

**Ejemplo:**
```bash
GET /api/products/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Limpiador Multiusos",
    "description": "Limpiador efectivo...",
    "price": 299.99,
    "category": "Limpiadores",
    "image_url": "https://...",
    "stock": 50,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Respuesta (404 Not Found):**
```json
{
  "error": "Producto no encontrado"
}
```

---

### 3. POST /products
Crea un nuevo producto. ⚠️ **Requiere autenticación admin**.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Limpiador Multiusos",
  "description": "Limpiador efectivo para todas las superficies del hogar",
  "price": 299.99,
  "category": "Limpiadores",
  "image_url": "https://ejemplo.com/producto.jpg",
  "stock": 50
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Limpiador Multiusos",
    "description": "Limpiador efectivo para todas las superficies",
    "price": 299.99,
    "category": "Limpiadores",
    "image_url": "https://ejemplo.com/producto.jpg",
    "stock": 50
  }'
```

**Respuesta (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Limpiador Multiusos",
    "description": "Limpiador efectivo...",
    "price": 299.99,
    "category": "Limpiadores",
    "image_url": "https://...",
    "stock": 50,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Respuesta (400 Bad Request):**
```json
{
  "error": "Datos inválidos",
  "details": {
    "fieldErrors": {
      "name": ["El nombre debe tener al menos 3 caracteres"]
    }
  }
}
```

**Respuesta (401 Unauthorized):**
```json
{
  "error": "No autorizado. Debes estar autenticado como admin."
}
```

---

### 4. PUT /products/:id
Actualiza un producto existente. ⚠️ **Requiere autenticación admin**.

**Parámetros:**
- `id` (obligatorio): ID del producto

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Limpiador Multiusos Pro",
  "description": "Limpiador profesional para todas las superficies",
  "price": 399.99,
  "category": "Limpiadores",
  "image_url": "https://ejemplo.com/producto-pro.jpg",
  "stock": 100
}
```

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:3000/api/products/uuid \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Limpiador Multiusos Pro",
    "price": 399.99,
    ...
  }'
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Limpiador Multiusos Pro",
    "price": 399.99,
    "updated_at": "2024-01-02T00:00:00Z",
    ...
  }
}
```

---

### 5. DELETE /products/:id
Elimina un producto. ⚠️ **Requiere autenticación admin**.

**Parámetros:**
- `id` (obligatorio): ID del producto

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/products/uuid
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Producto eliminado"
}
```

**Respuesta (404 Not Found):**
```json
{
  "error": "Producto no encontrado"
}
```

---

## Validación (Zod)

Todos los campos se validan con los siguientes criterios:

| Campo | Validación |
|-------|-----------|
| `name` | Mínimo 3 caracteres |
| `description` | Mínimo 10 caracteres |
| `price` | Número positivo |
| `category` | No puede estar vacío |
| `image_url` | URL válida (comenzar con http/https) |
| `stock` | Número entero no negativo |

---

## Autenticación

Para acceder a los endpoints protegidos (POST, PUT, DELETE), primero debes:

1. Acceder a `/admin/login`
2. Ingresa tu contraseña admin
3. Se creará una cookie `admin_session` httpOnly
4. Haz las solicitudes con esa sesión activa

La sesión expira después de 24 horas.

---

## Ejemplos de Uso

### Node.js / JavaScript
```javascript
// Crear producto
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Nuevo Producto',
    description: 'Descripción del producto',
    price: 199.99,
    category: 'Limpiadores',
    image_url: 'https://ejemplo.com/img.jpg',
    stock: 25
  })
})

const data = await response.json()
console.log(data)
```

### Python
```python
import requests

# Obtener productos
response = requests.get('http://localhost:3000/api/products')
products = response.json()

# Crear producto
data = {
    "name": "Nuevo Producto",
    "description": "Descripción del producto",
    "price": 199.99,
    "category": "Limpiadores",
    "image_url": "https://ejemplo.com/img.jpg",
    "stock": 25
}

response = requests.post('http://localhost:3000/api/products', json=data)
print(response.json())
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-----------|
| 200 | Éxito - GET, PUT |
| 201 | Creado - POST |
| 400 | Error de validación |
| 401 | No autorizado |
| 404 | Recurso no encontrado |
| 500 | Error del servidor |

---

## Notas de Seguridad

- ⚠️ Todos los endpoints protegidos requieren estar autenticado como admin
- ⚠️ Las contraseñas de admin se almacenan en cookies httpOnly (seguras)
- ⚠️ Usa HTTPS en producción
- ⚠️ Los datos se validan en el servidor (Zod)
