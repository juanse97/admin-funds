# Admin Fondos BTG

Aplicación web para la administración de fondos de inversión. Permite a los usuarios consultar fondos disponibles, suscribirse, cancelar suscripciones y visualizar el historial de transacciones.

---

## Tabla de Contenido

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Servidor Mock API (JSON Server)](#servidor-mock-api-json-server)
- [Ejecución en Desarrollo](#ejecución-en-desarrollo)
- [Compilación para Producción](#compilación-para-producción)
- [Pruebas Unitarias](#pruebas-unitarias)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)

---

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas antes de continuar:

| Herramienta     | Versión mínima  |
| --------------- | --------------- |
| **Node.js**     | 16.x o superior |
| **npm**         | 8.x o superior  |
| **Angular CLI** | 16.2.x          |

Para verificar las versiones instaladas:

```bash
node -v
npm -v
ng version
```

> Si no tienes Angular CLI instalado globalmente, puedes hacerlo con:
>
> ```bash
> npm install -g @angular/cli@16
> ```

---

## Instalación

1. **Clonar el repositorio:**

```bash
git clone <URL_DEL_REPOSITORIO>
cd admin-funds
```

2. **Instalar dependencias:**

```bash
npm install
```

Esto instalará todas las dependencias del proyecto, incluyendo `json-server` y `concurrently` como dependencias de desarrollo.

---

## Servidor Mock API (JSON Server)

La aplicación consume una API REST simulada mediante **JSON Server**. Los datos se encuentran en el archivo `mock-api/db.json` y exponen el endpoint `/funds` en el puerto **3000**.

### Iniciar solo el servidor Mock API

```bash
npm run api
```

Esto ejecuta:

```
json-server --watch mock-api/db.json --port 3000
```

Una vez iniciado, la API estará disponible en:

| Recurso    | URL                           |
| ---------- | ----------------------------- |
| **Fondos** | `http://localhost:3000/funds` |

### Datos disponibles

El archivo `mock-api/db.json` contiene 5 fondos de inversión con la siguiente estructura:

```json
{
  "id": 1,
  "name": "FPV_BTG_PACTUAL_RECAUDADORA",
  "minimumAmount": 75000,
  "category": "FPV"
}
```

> **Nota:** JSON Server soporta operaciones GET, POST, PUT, PATCH y DELETE automáticamente sobre los recursos definidos en `db.json`.

---

## Ejecución en Desarrollo

### Opción 1 — Frontend + API simultáneamente (recomendado)

```bash
npm run dev
```

Este comando utiliza `concurrently` para ejecutar en paralelo:

- **Frontend Angular** en `http://localhost:4200`
- **Mock API** en `http://localhost:3000`

### Opción 2 — Solo el servidor de desarrollo Angular

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/` y se recargará automáticamente al detectar cambios en los archivos fuente.

> **Importante:** Si ejecutas solo el frontend sin la API, las peticiones HTTP a `http://localhost:3000/funds` fallarán. Asegúrate de tener el servidor mock corriendo.

---

## Compilación para Producción

```bash
npm run build
```

Los artefactos de compilación se generarán en el directorio `dist/admin-fondos`.

Para compilación en modo watch (desarrollo):

```bash
npm run watch
```

---

## Pruebas Unitarias

### Ejecutar pruebas con Karma

```bash
npm test
```

### Ejecutar pruebas en modo headless con cobertura

```bash
npx ng test --no-watch --browsers=ChromeHeadless --code-coverage
```

El reporte de cobertura se genera en el directorio `coverage/admin-fondos/`. Abre `coverage/admin-fondos/index.html` en un navegador para visualizar el reporte detallado.

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── app.module.ts                  # Módulo raíz
│   ├── app-routing.module.ts          # Configuración de rutas (lazy loading)
│   ├── app.component.ts               # Componente raíz
│   ├── core/
│   │   └── services/                  # Servicios singleton (FundsService, WalletService, TransactionsService)
│   ├── features/
│   │   ├── funds/                     # Módulo de fondos (consulta y suscripción)
│   │   └── transactions/              # Módulo de transacciones (historial)
│   ├── shared/
│   │   ├── components/                # Componentes reutilizables (DataTable, FundCard, Modal, Loading)
│   │   └── models/                    # Interfaces y modelos (Fund, Subscription, Transaction)
│   └── utils/
│       └── constants.ts               # Constantes de la aplicación
├── assets/                            # Recursos estáticos
├── styles.scss                        # Estilos globales (Tailwind CSS)
├── main.ts                            # Punto de entrada
└── index.html                         # HTML principal
mock-api/
└── db.json                            # Base de datos simulada para JSON Server
```

### Rutas de la Aplicación

| Ruta            | Módulo             | Descripción                                  |
| --------------- | ------------------ | -------------------------------------------- |
| `/funds`        | FundsModule        | Listado de fondos y gestión de suscripciones |
| `/transactions` | TransactionsModule | Historial de transacciones                   |
| `/`             | —                  | Redirige a `/funds`                          |

> Ambos módulos de features utilizan **lazy loading** para optimizar el tiempo de carga inicial.

---

## Tecnologías

| Tecnología          | Versión    | Propósito                      |
| ------------------- | ---------- | ------------------------------ |
| **Angular**         | 16.2       | Framework frontend             |
| **TypeScript**      | 5.1        | Lenguaje tipado                |
| **Tailwind CSS**    | 3.4        | Framework de utilidades CSS    |
| **RxJS**            | 7.8        | Programación reactiva          |
| **Karma + Jasmine** | 6.4 / 4.6  | Framework de pruebas unitarias |
| **JSON Server**     | 1.0.0-beta | Simulación de API REST         |
| **Concurrently**    | 9.2        | Ejecución paralela de scripts  |
