# Química Clean

Sitio comercial de una distribuidora mayorista de productos de limpieza con base en Tucumán, Argentina. Catálogo dinámico, panel de administración protegido y captura de leads con notificación por email.

**Demo en vivo:** [quimica-clean.vercel.app](https://quimica-clean.vercel.app)

---

## Highlights

- **Catálogo dinámico** con productos y categorías servidos desde Supabase, sin redeploy.
- **Panel admin protegido** (`/admin`) con autenticación por cookie `httpOnly` y sesión de 24h.
- **CRUD completo** de productos y categorías, con upload de imágenes a Supabase Storage.
- **Captura de leads** desde el sitio público con notificación automática al admin por email vía Resend.
- **Mobile-first responsive**: hero adaptado por slide, navbar con menú hamburguesa, breakpoints centralizados (`lib/hooks.ts`).
- **SEO**: metadata Open Graph + Twitter Card, `sitemap.ts`, `robots.ts`, canonical URLs, `lang="es-AR"`.
- **Performance**: imágenes optimizadas (Next/Image + WebP/AVIF), `preconnect` a Supabase, fuentes vía `next/font`, lazy-load del widget de WhatsApp.
- **Validación con Zod** en login.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Lenguaje | TypeScript |
| BD / Auth / Storage | Supabase |
| Email transaccional | Resend |
| Validación | Zod |

## Setup local

```bash
git clone https://github.com/juanmd14/quimica-clean.git
cd quimica-clean
npm install
cp .env.example .env.local   # luego editar con tus valores
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (cliente browser) |
| `SUPABASE_SECRET_KEY` | Secret key (server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role para operaciones admin |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin` |
| `RESEND_API_KEY` | API key de Resend para notificar leads |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | (opcional) Override del WhatsApp del negocio |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (metadata, sitemap, robots). Default: `https://quimica-clean.vercel.app` |

## Estructura

```
app/
├── admin/            # Panel admin (login + dashboard + CRUD)
├── api/              # Route handlers
│   ├── admin/        # login / logout / session
│   ├── products/     # CRUD productos + upload
│   ├── categorias/   # CRUD categorías
│   └── leads/        # Captura pública de leads
├── components/       # Hero, Sections, Navbar, ContactFooter, WhatsAppChat...
├── productos/        # Listado público + detalle por id
└── legal/            # Página de términos / privacidad
lib/
├── auth.ts           # Sesión admin por cookie httpOnly
├── adminMiddleware.ts# Guard para route handlers admin
├── supabase.ts       # Cliente browser
├── supabaseAdmin.ts  # Cliente server (service role)
├── hooks.ts          # useBreakpoint compartido
├── types.ts          # Tipos de las tablas
├── validations.ts    # Schema Zod del login
└── config.ts         # Constantes de marca
```

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm start        # Servir build
npm run lint     # ESLint
```

## Schema de base de datos

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

create index idx_productos_categoria on productos(categoria);
create index idx_productos_orden     on productos(orden);
create index idx_leads_created_at    on leads(created_at desc);
```

Las imágenes se sirven desde el bucket público `products` de Supabase Storage. El dominio está allowlisteado en `next.config.ts`.

## Documentación adicional

- [`docs/API.md`](./docs/API.md) — referencia de los endpoints HTTP.
- [`docs/ADMIN_GUIDE.md`](./docs/ADMIN_GUIDE.md) — cómo usar el panel admin.

## Deploy

Deploy automático en Vercel desde `main`. Las variables de entorno se configuran en el dashboard del proyecto (Settings → Environment Variables) usando los mismos nombres de `.env.example`.

## Decisiones técnicas

- **Supabase** como BaaS unificado (Postgres + Auth + Storage). Free tier suficiente para el volumen del cliente y evita orquestar tres servicios distintos.
- **Cookie `httpOnly` para la sesión admin** en lugar de JWT en `localStorage`: no accesible desde JS del browser, mitiga XSS. La sesión vive 24h.
- **App Router + Server Components** para que el catálogo se renderice del lado del servidor (mejor SEO y first paint), y los componentes interactivos (hero slider, formularios) sean Client Components explícitos.
- **Validación con Zod en el server** (`lib/validations.ts`): el cliente puede mentir, el server no confía.
- **Tailwind v4 + algunos estilos inline** para componentes con animaciones complejas (hero, footer). Trade-off consciente: menos clases utility, más legibilidad en componentes con muchos valores derivados.
- **`NEXT_PUBLIC_SITE_URL` como env var** en lugar de hardcodear el dominio: permite cambiar el dominio definitivo desde el dashboard de Vercel sin redeploy.

## Licencia

MIT — ver [LICENSE](./LICENSE).
