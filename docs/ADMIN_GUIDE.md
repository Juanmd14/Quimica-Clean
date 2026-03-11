# 🔐 Acceso al Panel de Administración

## ¿Dónde está el Admin?

El panel de administración está disponible en:

```
http://localhost:3000/admin
```

O accede directamente al login en:

```
http://localhost:3000/admin/login
```

## 🔑 Credenciales

Para ingresar al panel de administración necesitas:

1. **Ir a**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. **Ingresar la contraseña** que configuraste en tu archivo `.env.local`

```env
NEXT_PUBLIC_ADMIN_PASSWORD=tu_contraseña_aqui
```

## 📊 Funcionalidades del Admin

Una vez autenticado, tendrás acceso a:

### 1. **Dashboard Principal** 
- Vista general del sistema
- Accesos rápidos a todas las funciones

### 2. **Gestión de Productos** (`/admin/dashboard/products`)
- ✅ **Crear nuevos productos** con formulario
- ✅ **Editar productos** existentes
- ✅ **Eliminar productos** 
- ✅ Vista de tabla con todos los productos
- ✅ Validación automática de datos

**Campos de un Producto:**
- **Nombre**: Mínimo 3 caracteres
- **Descripción**: Mínimo 10 caracteres
- **Precio**: Número positivo
- **Categoría**: Selecciona de las opciones disponibles
- **URL de Imagen**: Link válido (http o https)
- **Stock**: Número entero no negativo

### 3. **Próximas Funcionalidades**
- 📋 Ver Pedidos
- 👥 Gestionar Usuarios
- ⚙️ Configuración general

## 🔄 Rutas de la API para Productos

### GET `/api/products`
Obtiene la lista de productos (pública)

**Ejemplo:**
```bash
curl http://localhost:3000/api/products
```

### GET `/api/products/:id`
Obtiene un producto específico (pública)

### POST `/api/products` 
Crear nuevo producto (**requiere autenticación**)

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bidón de 5L",
    "description": "Bidón plástico seguro para químicos",
    "price": 150.00,
    "category": "Bidones de 5L",
    "image_url": "https://ejemplo.com/imagen.jpg",
    "stock": 25
  }'
```

### PUT `/api/products/:id`
Actualizar producto (**requiere autenticación**)

### DELETE `/api/products/:id`
Eliminar producto (**requiere autenticación**)

## 🔒 Seguridad

- **Autenticación por Cookie**: Se crea una cookie segura (httpOnly) al ingresar
- **Duración**: La sesión expira después de 24 horas
- **Protección**: Las contraseñas no se guardan en la base de datos
- **HTTPS**: En producción, siempre usa HTTPS

## 🚀 Primeros Pasos

1. **Configura `.env.local`**
   ```bash
   cp .env.example .env.local
   ```

2. **Edita las variables**
   ```env
   NEXT_PUBLIC_ADMIN_PASSWORD=contraseña_fuerte_123
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SECRET_KEY=tu_secret_key
   ```

3. **Inicia el servidor**
   ```bash
   npm run dev
   ```

4. **Accede al admin**
   - URL: http://localhost:3000/admin/login
   - Contraseña: contraseña_fuerte_123

5. **Comienza a agregar productos**
   - Navega a: http://localhost:3000/admin/dashboard/products
   - Haz clic en "+ Nuevo Producto"
   - Completa el formulario
   - ¡Listo! Tu producto aparecerá en la tienda

## 💡 Consejos

- Usa contraseñas fuertes con números, letras y símbolos
- En producción, cambia la contraseña regularmente
- Guarda tus credenciales de Supabase en un lugar seguro
- No compartas el archivo `.env.local` en el repositorio

## ❓ Problemas Comunes

### "Contraseña incorrecta"
- Verifica que la contraseña en `.env.local` sea correcta
- Reinicia el servidor después de cambiar `.env.local`

### "Error al conectar a Supabase"
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de que tengas conexión a Internet

### "La tabla de productos no existe"
- Crea la tabla en Supabase con la siguiente estructura SQL:
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

## 📞 Soporte

Para reportar problemas o sugerencias, contacta con el equipo de desarrollo.

---

**Última actualización**: Marzo 2026
