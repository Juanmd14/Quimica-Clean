# Panel de administración

El panel admin permite gestionar el catálogo, las categorías y los leads recibidos desde el sitio público.

## Acceso

URL: `http://localhost:3000/admin/login` (en prod: `https://quimica-clean.vercel.app/admin/login`).

La contraseña se define en `.env.local` como `ADMIN_PASSWORD`. Al hacer login se crea una cookie `admin_session` (httpOnly, sameSite=strict) válida por 24 horas.

## Secciones

| Ruta | Qué hace |
|---|---|
| `/admin/dashboard` | Acceso rápido a productos, categorías y leads |
| `/admin/dashboard/products` | CRUD de productos + upload de imagen |
| `/admin/dashboard/categorias` | CRUD de categorías + asignar imagen |
| `/admin/dashboard/leads` | Listado de leads recibidos desde el formulario público |

## Productos

Cada producto tiene los siguientes campos (ver `lib/types.ts`):

- `nombre` *(obligatorio)*
- `categoria` *(obligatorio)* — debe coincidir con una categoría existente
- `descripcion`
- `color`, `color2` — para el gradient del card en el catálogo
- `emoji` — fallback visual si no hay imagen
- `imagen_url` — apunta al bucket `productos` de Supabase Storage
- `activo` — si está en false, no aparece en el sitio público
- `orden` — usado para ordenar dentro de la categoría

El upload de imagen pasa por `POST /api/products/upload`, que sube al bucket `productos` y devuelve la URL pública para guardar en `imagen_url`.

## Categorías

- `nombre`, `emoji`, `imagen_url`, `orden`.
- El sitio público muestra todas las categorías ordenadas por `orden`.

## Leads

El listado muestra todos los leads recibidos por `POST /api/leads`. Cada lead se guarda en la tabla `leads` y, si está configurada `RESEND_API_KEY`, dispara un email de notificación al admin.

## Schema SQL

```sql
create table productos (
  id          bigserial primary key,
  nombre      text not null,
  categoria   text not null,
  descripcion text,
  color       text,
  color2      text,
  emoji       text,
  imagen_url  text,
  activo      boolean not null default true,
  orden       int not null default 0
);

create table categorias (
  id         bigserial primary key,
  nombre     text not null,
  emoji      text,
  imagen_url text,
  orden      int not null default 0
);

create table leads (
  id               bigserial primary key,
  nombre           text not null,
  telefono         text not null,
  producto_interes text,
  mensaje          text,
  created_at       timestamptz not null default now()
);
```

Además, crear un bucket público llamado `productos` en Supabase Storage para guardar las imágenes.

## Seguridad

- Todas las mutaciones (`POST` / `PUT` / `DELETE`) están protegidas por `requireAdminAuth` (ver `lib/adminMiddleware.ts`), que verifica la cookie de sesión.
- La contraseña nunca se guarda en BD: la comparación se hace contra `process.env.ADMIN_PASSWORD` en el servidor (`lib/auth.ts`).
- En producción la cookie usa `secure: true`.
