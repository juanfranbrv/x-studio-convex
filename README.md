# 🎨 X-Studio (Private Repo)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Convex](https://img.shields.io/badge/Convex-Backend-8B5CF6?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)

**Generador de contenido visual con IA para marcas**

*Transforma tu identidad de marca en contenido visual profesional en segundos*

</div>

---

## 👋 Introducción (Para ti, Juanfran)

Este documento no es solo un README estándar, es tu **manual de operaciones y memoria externa**. X-Studio es un sistema complejo que orquesta múltiples inteligencias artificiales, bases de datos en tiempo real y scraping avanzado. Aquí encontrarás cómo encajan todas las piezas, recordatorios sobre la arquitectura y los procesos clave para mantener y escalar el proyecto.

Recuerda:
- **Filosofía**: Herramientas potentes pero invisibles. El usuario ve "magia", nosotros gestionamos complejidad.
- **Prioridad**: Estabilidad y coherencia visual (Shadcn + Tailwind).
- **Entorno**: Desarrollado y optimizado para **Windows**.

---

## 🏗️ Arquitectura del Sistema

X-Studio opera bajo una arquitectura **Serverless & Real-time**. No hay servidores backend tradicionales que mantener; todo corre en funciones cloud (Convex) y Edge (Next.js/Vercel).

```mermaid
graph TD
    subgraph Frontend [Next.js Client]
        UI[React 19 Components]
        Store[Convex React Client]
        Auth[Clerk Provider]
    end

    subgraph Backend [Convex Serverless]
        Func[Queries & Mutations]
        DB[(Convex Database)]
        Cron[Schedulers / Crons]
        Actions[Convex Actions (Node.js)]
    end

    subgraph External [Servicios Externos]
        AI_Text[Gemini / Groq / OpenAI]
        AI_Img[Imagen / DALL-E / Flux]
        Scraper[Firecrawl]
        AuthSvc[Clerk API]
    end

    UI <-->|Real-time Updates| Store
    Store <-->|RPC Calls| Func
    Func <--> DB
    Func -->|Call Action| Actions
    Actions <-->|API Calls| External
    Auth <--> AuthSvc
```

### Puntos Clave:
1.  **Frontend (Next.js 16)**: Renderiza la UI y maneja el estado local. Usa `useQuery` y `useMutation` de Convex para interactuar con los datos.
2.  **Backend (Convex)**:
    *   **Queries**: Lectura rápida y reactiva (cacheada automáticamente).
    *   **Mutations**: Escritura transaccional en la DB.
    *   **Actions**: Funciones que pueden tardar más y hablar con APIs externas (aquí viven las llamadas a Gemini, Firecrawl, etc.).
3.  **IA & Scraping**: Son invocados desde las *Actions* de Convex para no bloquear el hilo principal ni exponer API Keys.

---

## 📂 Estructura del Proyecto

El proyecto está organizado para separar claramente la UI, la lógica de negocio y los servicios.

```
x-studio-convex/
├── convex/                  # 🧠 EL CEREBRO (Backend)
│   ├── schema.ts            # Definición de la Base de Datos (Tablas e índices)
│   ├── brands.ts            # Lógica de marcas (CRUD)
│   ├── users.ts             # Gestión de usuarios y sincronización con Clerk
│   ├── generations.ts       # Lógica de generación de imágenes
│   ├── analyze_brand.ts     # (O similar) Lógica compleja de análisis con IA
│   └── ...                  # Otras funciones backend
├── src/
│   ├── app/                 # 🌐 Rutas (App Router)
│   │   ├── studio/          # Página principal del editor
│   │   ├── brand-kit/       # Gestión de marcas
│   │   ├── api/             # Endpoints Next.js (webhooks de Clerk, etc.)
│   │   └── ...
│   ├── components/          # 🧩 Piezas de UI
│   │   ├── ui/              # Shadcn (Botones, Inputs, Dialogs) - NO TOCAR ESTILOS BASE
│   │   ├── studio/          # Componentes específicos del editor
│   │   └── brand-dna/       # Visualización de análisis de marca
│   ├── lib/                 # 🛠️ Utilidades
│   │   ├── utils.ts         # Helpers generales (cn, formateadores)
│   │   ├── ai-config.ts     # Configuración de modelos
│   │   └── ...
│   └── hooks/               # Custom React Hooks
├── public/                  # Assets estáticos (imágenes, fuentes)
└── ...config files          # (next, tailwind, tsconfig, convex, etc.)
```

---

## ⚙️ Flujos Críticos (Core Workflows)

### 1. 🧬 Brand DNA Analysis (El "Wow" inicial)
1.  **Input**: El usuario introduce una URL.
2.  **Action (Convex)**: Se lanza una acción que llama a **Firecrawl**.
3.  **Scraping**: Firecrawl devuelve el contenido textual y visual de la web.
4.  **Procesamiento (Gemini)**: Se envía el contenido a **Gemini** con un prompt estructurado para extraer:
    *   Colores (Hex + Confianza)
    *   Fuentes
    *   Tono de voz
    *   Valores de marca
5.  **Persistencia**: El resultado se guarda en la tabla `brand_dna` y `brands`.

### 2. 🎨 Generación de Imágenes (El Producto)
1.  **Configuración**: El usuario selecciona un Preset, un Estilo y una Marca (Contexto).
2.  **Prompt Engineering**: El sistema combina:
    *   Datos del Brand DNA (Colores, Tono).
    *   Prompt del usuario.
    *   Modificadores del estilo seleccionado.
3.  **Action (Convex)**: Se llama a la API de generación de imagen (DALL-E / Flux / Imagen).
4.  **Resultado**: La URL de la imagen generada se guarda en `generations` y se muestra en tiempo real al usuario.

### 3. 🔐 Autenticación y Sincronización
1.  **Login**: Clerk maneja el frontend (Login/Signup).
2.  **Webhook**: Al crearse un usuario en Clerk, se dispara un webhook a `src/app/api/webhooks/clerk`.
3.  **Sync**: El webhook llama a una mutación interna de Convex para crear/actualizar el registro en la tabla `users`.
4.  **Créditos**: El usuario nace con un saldo de créditos definido en `app_settings` (o 0 si no es beta).

---

## 💽 Modelo de Datos (Convex Schema)

Un recordatorio rápido de las tablas principales en `convex/schema.ts`:

*   **`users`**: Espejo de Clerk + Créditos + Roles (`admin`, `beta`, `user`).
*   **`brands`**: La entidad "Marca". Tiene nombre y referencia al propietario.
*   **`brand_dna`**: El resultado *técnico* del análisis (colores, fuentes, assets).
*   **`generations`**: Historial de imágenes creadas. Guarda el prompt exacto usado.
*   **`presets`**: Configuraciones guardadas por el usuario o el sistema para reutilizar estilos.
*   **`credit_transactions`**: Auditoría inmutable de cada gasto o recarga de créditos.

---

## 💻 Guía de Desarrollo

### Requisitos Previos
*   Node.js 20+
*   Cuenta en Clerk & Convex
*   **Windows** (Entorno nativo del proyecto)

### Variables de Entorno (`.env.local`)
Asegúrate de tener estas claves:
```env
# Convex
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# IA Services
GEMINI_API_KEY=...
GROQ_API_KEY=...
OPENAI_API_KEY=...
FIRECRAWL_API_KEY=...
```

### Comandos Comunes

| Comando | Acción | Notas |
| :--- | :--- | :--- |
| `npm run dev` | Inicia Next.js + Convex | **Comando principal**. Abre `localhost:3000`. |
| `npx convex dev` | Inicia solo Convex | Útil si solo tocas backend. |
| `npm run dev:mobile` | Dev con acceso externo | Usa ngrok/tunnel para probar en móvil. |
| `npm run build` | Compila para producción | Ejecutar antes de deployar. |
| `npm run lint` | Revisa código | ESLint. |

### Convex Dashboard
Usa `npx convex dashboard` para abrir el panel de control. Desde ahí puedes:
1.  Ver y editar datos en tiempo real.
2.  Ver logs de funciones y errores.
3.  Gestionar `app_settings` (ej. cambiar créditos iniciales).
4.  Configurar Cron Jobs.

---

## 🚀 Despliegue (Deployment)

El despliegue es un proceso de dos pasos sincronizados:

1.  **Convex**:
    *   Al hacer push a `main`, si tienes configurado el GitHub Action o Vercel Integration, Convex se despliega automáticamente.
    *   Manual: `npx convex deploy`.

2.  **Vercel (Frontend)**:
    *   Conectado al repo de GitHub.
    *   Deploy automático en push a `main`.
    *   **Importante**: Las variables de entorno en Vercel deben coincidir con las locales (excepto las de desarrollo).

---

## 🎨 Sistema de Diseño

Nos basamos en **Shadcn UI** + **Tailwind CSS**.
*   **Principios**: Revisa `principios_de_diseño.md`.
*   **Regla de Oro**: No sobrescribas estilos de componentes base (`src/components/ui`). Úsalos o crea variantes nuevas si es necesario, pero mantén la coherencia.
*   **Iconos**: Usa `lucide-react`.

---

## 🔧 Mantenimiento y Troubleshooting

### Windows Specifics
*   **Terminal**: Usa Powershell o Git Bash. Evita CMD si es posible.
*   **Scripts**: Algunos scripts en `package.json` usan `powershell -ExecutionPolicy Bypass`. Si fallan, verifica tus políticas de ejecución.
*   **Codificación**: Si ves caracteres extraños (mojibake), revisa la codificación UTF-8 en los archivos o variables de entorno (`PYTHONUTF8=1` si usas scripts de Python).

### Actualización de Dependencias
1.  Revisar `package.json`.
2.  `npm outdated`.
3.  Actualizar con cuidado: `npm update` o manual.
4.  **Siempre verificar**: Que Convex y Next.js sean compatibles.

### Problemas Comunes
*   *Error: "Auth key invalid"* -> Revisa las claves de Clerk en `.env.local`.
*   *Error: "Convex function not found"* -> Asegúrate de que `npx convex dev` esté corriendo y haya sincronizado los cambios.
*   *Imagen no carga* -> Verifica los dominios permitidos en `next.config.ts` para componentes `Image`.

---

## 📄 Licencia

**Privado y Propietario**. Todos los derechos reservados.
Desarrollado con ❤️ para X-Studio.
