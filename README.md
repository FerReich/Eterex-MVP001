# eTerex Distribución — MVP

Scaffold inicial del reemplazo de Excel/Sheets para el proceso de **Distribución BASF + Planning**.
Uso interno, con login y roles (`ADMIN`, `PLANIFICADOR`, `RENDICION`).

## Qué incluye este scaffold

- **Next.js 15** (App Router, TypeScript, Tailwind)
- **Prisma + Postgres** — schema con las 8 entidades del proceso (Planta, Unidad, Chofer,
  Disponibilidad, Viaje, Rendición, CódigoRendición, Usuario)
- **NextAuth v5** (Credentials) con roles y rutas protegidas por middleware
- 5 pantallas funcionales conectadas a la base:
  - `/` — panel con métricas rápidas
  - `/disponibilidad` — flota disponible por fecha/planta
  - `/viajes` — carga y asignación de chofer/unidad
  - `/planning` — vista agrupada por chofer
  - `/rendiciones` — pendientes de rendición + listado cargado
  - `/cierre-facturacion` — agrupación en código de rendición para AGA

Las tablas leen de la base real vía Prisma. Los botones de acción (cargar, importar, generar
código) están maquetados pero **sin la mutación conectada todavía** — es el siguiente paso.

## Setup local

1. **Base de datos**: creá un Postgres (gratis) en [Neon](https://neon.tech),
   [Supabase](https://supabase.com) o [Vercel Postgres](https://vercel.com/storage/postgres).
2. Copiá `.env.example` a `.env` y completá `DATABASE_URL`.
3. Generá `AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
4. Instalá dependencias y aplicá el schema:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
   El seed crea el usuario `admin@eterex.com` / `eterex2026` y datos de ejemplo (2 plantas,
   1 unidad, 1 chofer, 1 disponibilidad).
5. Correr en desarrollo:
   ```bash
   npm run dev
   ```

## Deploy (mismo flujo que ya usás para CIPERVA)

1. Subí el repo a GitHub.
2. Importalo en Vercel (conectado al repo, como el sitio de CIPERVA).
3. Agregá `DATABASE_URL` y `AUTH_SECRET` en las variables de entorno del proyecto en Vercel.
4. Vercel corre `npm run build` automático en cada push a `main`.

## Próximos pasos sugeridos

1. **Conectar las mutaciones**: los formularios de "cargar disponibilidad", "importar viajes",
   "asignar chofer/unidad" y "generar código de rendición" (server actions o API routes).
2. **Import de Excel**: el cliente sigue mandando el archivo con las cargas del día siguiente —
   conviene un endpoint que reciba ese `.xlsx` y lo mapee a `Viaje` en vez de un formulario manual
   (usar `xlsx`/`SheetJS` en el server).
3. **Permisos por rol**: hoy el middleware sólo valida que haya sesión; falta restringir
   `cierre-facturacion` a `ADMIN`/`RENDICION` por ejemplo.
4. **Notificaciones**: reemplazar el mail manual de disponibilidad por un envío automático
   (Resend/SendGrid) o dejarlo como exportable.
5. **Módulos siguientes** (fuera de este MVP): Kimberly (con acceso de proveedor externo),
   Material Técnico (stock), Clientes Varios.

## Credenciales de prueba (después del seed)

- Email: `admin@eterex.com`
- Password: `eterex2026`

Cambiá esta contraseña antes de usar en producción real.
