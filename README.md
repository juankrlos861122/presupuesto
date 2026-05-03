# Presupuesto Personal

Aplicación web para gestionar finanzas personales - presupuesto, ingresos, gastos, ahorros y objetivos financieros.

## Características

- 📊 Dashboard con estadísticas financieras
- 💰 Registro de ingresos y gastos por categoría
- 🏦 Gestión de ahorros con seguimiento de progreso
- 🎯 Objetivos financieros con límite de tiempo
- 📈 Gráficos de evolución financiera
- 📄 Exportación de reportes (PDF/Excel)
- 🔐 Autenticación (email/contraseña + Google OAuth)
- 🤖 Protección reCAPTCHA v3

## Tech Stack

- **Backend:** NestJS + Prisma + PostgreSQL (Neon)
- **Frontend:** Angular 17 + Bootstrap
- **Auth:** JWT + Passport.js (Google OAuth)
- **Reports:** PDFKit + ExcelJS

## Requisitos

- Node.js 18+
- PostgreSQL (o usar Neon DB)
- Cuenta de Google Cloud (para OAuth)
- Cuenta de reCAPTCHA (Google)

## Variables de Entorno

Crear archivo `.env` en `apps/backend/`:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=tu_secret_jwt
JWT_EXPIRES_IN=7d
PORT=3001

# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# reCAPTCHA
RECAPTCHA_SECRET_KEY=tu_secret_key

# Frontend
FRONTEND_URL=http://localhost:4200
```

## Instalación

```bash
# Instalar dependencias
npm install

# Backend
cd apps/backend
npm run start:dev

# Frontend
cd apps/frontend
npm start
```

## Estructura del Proyecto

```
presupuesto/
├── apps/
│   ├── backend/          # API NestJS
│   │   ├── src/
│   │   │   ├── auth/     # Autenticación
│   │   │   ├── dashboard/
│   │   │   ├── transacciones/
│   │   │   ├── ahorros/
│   │   │   └── objetivos/
│   │   └── prisma/       # Schema DB
│   └── frontend/         # App Angular
│       └── src/app/
│           ├── dashboard/
│           ├── transacciones/
│           ├── ahorros/
│           └── objetivos/
└── package.json
```

## API Endpoints

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/google` - Login con Google
- `GET /auth/google/callback` - Callback Google

### Transacciones
- `GET /transacciones` - Listar transacciones
- `POST /transacciones` - Crear transacción
- `PUT /transacciones/:id` - Actualizar
- `DELETE /transacciones/:id` - Eliminar
- `GET /transacciones/resumen` - Resumen mensual

### Ahorros
- `GET /ahorros` - Listar ahorros
- `POST /ahorros` - Crear ahorro
- `PUT /ahorros/:id/depositar` - Depositar
- `GET /ahorros/:id/historial` - Ver historial

### Objetivos
- `GET /objetivos` - Listar objetivos
- `POST /objetivos` - Crear objetivo
- `PUT /objetivos/:id` - Actualizar/Aportar
- `GET /objetivos/:id/historial` - Ver historial

### Dashboard
- `GET /dashboard/estadisticas` - Estadísticas generales
- `GET /dashboard/graficos` - Gráficos por mes

## Licencia

MIT