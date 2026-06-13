# 🍽️ Al Momento — Sistema de Pedidos para Restaurantes

Al Momento es un sistema de gestión de pedidos diseñado para restaurantes locales. Permite a los clientes hacer pedidos escaneando un código QR en su mesa, mientras el personal del restaurante gestiona todo desde un panel de administración en tiempo real.

## ✨ Características

- **Menú digital por mesa** — Los clientes escanean el QR de su mesa y acceden al menú directamente desde su teléfono
- **Pedidos en tiempo real** — Los pedidos llegan al panel del admin al instante usando Server-Sent Events (SSE)
- **Panel de administración** — Gestión completa de mesas, pedidos, menú y analytics
- **Acumulación de pedidos** — Los clientes pueden agregar más ítems durante la misma sesión sin perder lo anterior
- **Generación de QR** — El admin genera los QR de todas las mesas con un solo clic, listos para imprimir
- **Editor de menú** — Agregar, editar, eliminar platos y subir imágenes arrastrando archivos
- **Analytics** — Ventas por día, platos más pedidos, historial de cuentas cerradas con paginación
- **Acceso protegido** — Panel admin protegido por PIN configurable
- **100% local** — Funciona sin internet, solo necesita WiFi local entre la PC y los dispositivos

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend & Backend | Next.js 16 (App Router) |
| Base de datos | SQLite vía Prisma 7 |
| Tiempo real | Server-Sent Events (SSE) |
| Estilos | Tailwind CSS v4 |
| Lenguaje | TypeScript |
| QR | qrcode |

## 📁 Estructura del Proyecto

```
al-momento/
├── app/
│   ├── admin/
│   │   ├── analytics/      ← Panel de análisis y ventas
│   │   ├── configuracion/  ← Generador de QR y cambio de PIN
│   │   ├── menu/           ← Editor del menú
│   │   ├── mesas/          ← Estado de mesas en tiempo real
│   │   ├── orders/         ← Gestión de pedidos activos
│   │   └── login/          ← Acceso protegido por PIN
│   ├── api/
│   │   ├── analytics/      ← Estadísticas del día
│   │   ├── auth/           ← Login y cambio de PIN
│   │   ├── events/         ← Canal SSE tiempo real
│   │   ├── menu/           ← CRUD del menú
│   │   ├── mesas/          ← Estado de mesas
│   │   ├── pedidos/        ← Gestión de pedidos
│   │   ├── qr/             ← Generación de QR
│   │   └── upload/         ← Subida de imágenes
│   └── mesa/[id]/          ← Vista del cliente (menú + carrito)
├── components/
│   ├── admin/              ← Componentes del panel admin
│   └── cliente/            ← Componentes de la vista del cliente
├── context/
│   └── CartContext.tsx     ← Estado global del carrito
├── lib/
│   ├── db.ts               ← Cliente Prisma
│   ├── seed.ts             ← Datos iniciales
│   ├── sse.ts              ← Sistema de tiempo real
│   └── types.ts            ← Tipos TypeScript
├── prisma/
│   └── schema.prisma       ← Esquema de la base de datos
└── public/
    ├── products/           ← Imágenes de los platos
    └── qr/                 ← QR generados por mesa
```

## 🚀 Instalación

### Requisitos
- Node.js 20+
- pnpm

### Pasos

```bash
# 1. Clona el repositorio


# 2. Instala las dependencias
pnpm install

# 3. Configura la base de datos
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma generate

# 4. Inicia el servidor
pnpm run dev
```

Abre [http://localhost:3000/admin](http://localhost:3000/admin) en el navegador.

El PIN inicial es **1234**. Cámbialo desde Configuración.

## 📱 Uso

### Para el administrador
1. Doble clic en `iniciar.bat` (o `pnpm run dev`)
2. Abre `http://localhost:3000/admin` en el navegador de la PC
3. Ve a **Configuración** → genera los QR para cada mesa
4. Imprime o descarga los QR y colócalos en las mesas físicas

### Para los clientes
1. Escanear el QR de la mesa con la cámara del teléfono
2. Seleccionar platos y agregar al carrito
3. Confirmar el pedido — llega al admin al instante

### Red local
Para que funcione, la PC y los teléfonos de los clientes deben estar conectados a la **misma red WiFi**. Al generar los QR, el sistema detecta automáticamente la IP local de la PC.

## ⚙️ Variables de entorno

```env
DATABASE_URL="file:./data/database.db"
```

## 📊 Base de datos

El archivo de la base de datos se guarda en `data/database.db`. Para hacer backup solo copia ese archivo.

Para ver la base de datos visualmente:
```bash
pnpm dlx prisma studio
```

## 🔐 Seguridad

El panel de administración está protegido por PIN. Para cambiar el PIN: Admin → Configuración → Cambiar PIN.

Si olvidas el PIN, puedes resetearlo con Prisma Studio o editando directamente la tabla `Config`.

## 📄 Licencia

MIT
