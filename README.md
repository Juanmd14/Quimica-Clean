# Quimica Clean - E-Commerce de Productos Químicos

Plataforma moderna de e-commerce para la venta de productos químicos y de limpieza, construida con Next.js 16, React 19, TypeScript y Supabase.

## Características

- 🛍️ **Catálogo de Productos**: Gestión completa de productos químicos y de limpieza
- 🔐 **Panel Admin Protegido**: Administra tu negocio de forma segura
- 📱 **Responsive Design**: Optimizado para todos los dispositivos
- 💾 **Base de Datos**: Integración con Supabase
- 📝 **Validación de Datos**: Validación con Zod en backend y frontend
- ⚡ **Rendimiento**: Optimizado con Next.js App Router
- 🎨 **Tailwind CSS**: Estilos modernos y personalizables

## Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

## Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd quimica-clean
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
SUPABASE_SECRET_KEY=tu_secret_key_de_supabase
ADMIN_PASSWORD=tu_contraseña_admin_segura
NEXT_PUBLIC_WHATSAPP_NUMBER=+5493811234567
```

4. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Acceder al Panel Admin

El panel de administración está protegido y solo accesible con contraseña.

**URL del Admin**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Para más detalles, consulta la [Guía del Admin](./docs/ADMIN_GUIDE.md)

## Estructura del Proyecto

```
quimica-clean/
├── app/
│   ├── admin/                 # Panel de administración
│   │   ├── login/            # Página de login
│   │   ├── dashboard/        # Dashboard principal
│   │   └── layout.tsx        # Layout protegido
│   ├── api/                   # Rutas API
│   │   └── admin/
│   │       ├── login/        # Login endpoint
│   │       ├── logout/       # Logout endpoint
│   │       └── session/      # Verificar sesión
│   ├── components/            # Componentes React
│   └── page.tsx              # Página principal
├── lib/
│   ├── config.ts             # Configuración centralizada
│   ├── types.ts              # Tipos TypeScript
│   ├── validations.ts        # Esquemas Zod
│   ├── auth.ts               # Autenticación
│   └── supabase.ts           # Cliente Supabase
└── public/                    # Archivos estáticos
```

## Scripts Disponibles

```bash
# Desarrollar
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Ejecutar linter
npm run lint
```

## Seguridad

⚠️ **Importante**: 
- Nunca subas `.env.local` al repositorio
- Usa una contraseña fuerte para el admin
- En producción, usa variables de entorno seguras en tu plataforma de hosting
- Las contraseñas de admin se almacenan en cookies httpOnly

## Tecnologías

- **Next.js 16**: Framework React moderno
- **React 19**: Biblioteca UI
- **TypeScript**: Type-safety
- **Tailwind CSS 4**: Estilos
- **Supabase**: Base de datos y autenticación
- **Zod**: Validación de esquemas
- **ESLint**: Linting de código

## Desarrollo

### Agregar nuevos productos

Usa el endpoint POST `/api/admin/products` con validación Zod:

```typescript
{
  "name": "Limpiador Multiusos",
  "description": "Limpiador efectivo para todas las superficies",
  "price": 299.99,
  "category": "Limpiadores",
  "image_url": "https://...",
  "stock": 50
}
```

### Crear nuevas rutas protegidas

Todas las rutas en `/admin/*` están protegidas automáticamente por el middleware de autenticación.

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Soporte

Para soporte, contáctanos por WhatsApp o email.

---

Hecho con ❤️ para Quimica Clean
