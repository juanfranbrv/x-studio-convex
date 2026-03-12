# Referencia TÃ©cnica

Documento vivo de referencia tÃ©cnica para Juanfran y cualquier IA que trabaje en `x-studio`.

## DetecciÃ³n de idioma con Detect Language API

### PropÃ³sito

Se usa para mejorar la detecciÃ³n de idioma en prompts cortos o ambiguos, especialmente en espaÃ±ol, catalÃ¡n y portuguÃ©s.

No sustituye por completo la heurÃ­stica local:

- en cliente se mantiene detecciÃ³n local sÃ­ncrona
- en servidor se usa Detect Language API con fallback local

Esto evita exponer la clave y mantiene la app funcional si la API falla.

### ConfiguraciÃ³n

- Variable de entorno: `DETECT_LANGUAGE_API_KEY`
- Endpoint: `POST https://ws.detectlanguage.com/0.2/detect`
- AutenticaciÃ³n: `Authorization: Bearer <API_KEY>`

### ImplementaciÃ³n compartida

Archivo base:

- [src/lib/language-detection.ts](F:/_PROYECTOS/x-studio/src/lib/language-detection.ts)

Funciones principales:

- `detectLanguage(text)`: heurÃ­stica local sÃ­ncrona
- `detectLanguageFromParts(parts, fallback)`: heurÃ­stica local para varias entradas
- `detectLanguageWithApi(text, fallback)`: detecciÃ³n en servidor con API + fallback local
- `detectLanguageFromPartsWithApi(parts, fallback)`: variante agregada para varias entradas

### DÃ³nde se usa

Acciones de servidor conectadas a la API:

- [src/app/actions/generate-social-post.ts](F:/_PROYECTOS/x-studio/src/app/actions/generate-social-post.ts)
- [src/app/actions/generate-carousel.ts](F:/_PROYECTOS/x-studio/src/app/actions/generate-carousel.ts)
- [src/app/actions/parse-intent.ts](F:/_PROYECTOS/x-studio/src/app/actions/parse-intent.ts)
- [src/app/actions/analyze-brand-dna.ts](F:/_PROYECTOS/x-studio/src/app/actions/analyze-brand-dna.ts)

Uso local sÃ­ncrono en cliente o utilidades que no deben depender de red:

- hooks del flujo de creaciÃ³n
- lÃ³gica de apoyo en imagen/carrusel
- constructores de prompt que necesitan respuesta inmediata

### Regla de decisiÃ³n

El sistema sigue esta prioridad:

1. heurÃ­stica local
2. consulta a Detect Language API en servidor
3. si la API es fiable, se acepta su idioma
4. si falla, no hay clave o la respuesta es dudosa, se conserva el resultado local

### Notas de mantenimiento

- No mover la llamada a la API a cliente.
- No usar esta integraciÃ³n para bloquear flujos crÃ­ticos.
- Si aparece una regresiÃ³n en detecciÃ³n, ajustar primero [src/lib/language-detection.ts](F:/_PROYECTOS/x-studio/src/lib/language-detection.ts), no parchear cada mÃ³dulo por separado.
## Plan vivo de responsive e internacionalizacion

Existe un checklist operativo para abordar la revision responsive/mobile y la internacionalizacion ES/EN:

- [docs/RESPONSIVE_I18N_CHECKLIST.md](F:/_PROYECTOS/x-studio/docs/RESPONSIVE_I18N_CHECKLIST.md)

Decision de trabajo actual:

1. estabilizar responsive/mobile primero
2. introducir i18n despues sobre layouts ya saneados
3. hacer una pasada final de ajuste con textos reales en espanol e ingles

Nota operativa:

- En esta sesion no se ha encontrado `DONT_TOUCH.md` en la raiz del proyecto. Antes de tocar componentes marcados como estables conviene restaurar ese inventario o confirmar manualmente que zonas no deben modificarse.

## Arquitectura de internacionalizacion

### Stack actual

- Libreria base: `i18next` + `react-i18next`
- Provider cliente: [src/components/providers/I18nProvider.tsx](F:/_PROYECTOS/x-studio/src/components/providers/I18nProvider.tsx)
- Configuracion central: [src/lib/i18n.ts](F:/_PROYECTOS/x-studio/src/lib/i18n.ts)
- Locales soportados: [src/locales/config.ts](F:/_PROYECTOS/x-studio/src/locales/config.ts)

### Idiomas activos

- `es-ES` (por defecto)
- `en-US`

La arquitectura queda preparada para sumar mas idiomas anadiendo nuevos directorios de locale y registrandolos en `src/lib/i18n.ts` y `src/locales/config.ts`.

### Namespaces actuales

- `common`: shell compartida, navegacion, acciones globales, creditos
- `auth`: pantallas y componentes de acceso
- `home`: landing, estados de beta y footer
- `settings`: preferencias de usuario
- `video`: modulo de video
- `image`: shell del modulo de imagen, dialogs de sesion, toasts visibles y panel principal
- `carousel`: shell del modulo de carrusel, dialogs de sesion, CTA principales y panel principal
- `brandKit`: carga, toasts y estados base del modulo de kit de marca

### Reglas de implementacion

1. No hardcodear texto UI nuevo en componentes.
2. Reutilizar `common` para textos compartidos y crear namespace propio cuando un modulo crezca.
3. Persistir idioma en `localStorage` con la clave `xstudio.locale`.
4. Cambiar idioma siempre a traves de `setAppLocale()`.
5. Pensar los textos para expansion futura; evitar concatenaciones manuales.

### Estado de rollout

- Shell principal y menu movil ya internacionalizados.
- Header, sidebar, creditos, auth, landing, settings y video ya cuelgan del sistema i18n.
- `image`, `carousel` y `brand-kit` ya tienen namespace propio y una segunda ola aplicada sobre shells, dialogs, CTA, placeholders, toasts visibles y paneles principales.
- Los catalogos del carrusel que llegan desde Convex se localizan por `structure_id` y `composition_id` en cliente para no depender del idioma guardado en base de datos.
- Las descripciones legacy de composiciones del carrusel usan `layoutPrompt` como fallback en ingles cuando el registro historico solo trae copy en espanol.

### Deuda conocida

- El repo sigue teniendo mojibake heredado en archivos antiguos fuera del bloque nuevo de i18n.
- Antes de cerrar fases grandes de texto UI conviene ejecutar una busqueda de `Ãƒ`, `Ã‚` y `ï¿½` sobre `src`.
## Loading, cancelacion y paginas legales

### Spinner global

- El proyecto usa [src/components/ui/spinner.tsx](F:/_PROYECTOS/x-studio/src/components/ui/spinner.tsx) como spinner visual unico.
- La implementacion replica el loader `blocks-shuffle-3` y se expone como `Loader2` para mantener compatibilidad con el resto del codigo.
- No se deben introducir nuevos spinners con `animate-spin` o SVG distintos en componentes de producto.

### Regla de cancelacion en procesos largos

- Los flujos largos visibles para usuario deben exponer una accion `Detener` o `Stop`, tambien en mobile.
- El patron actual se aplica en:
  - `image`: analisis de prompt y generacion de imagen
  - `carousel`: analisis de prompt y generacion de carrusel
  - `brand-kit`: analisis principal y analisis lanzado desde el asistente
- La cancelacion visual debe estar internacionalizada y, cuando sea posible, abortar la operacion real con `AbortController` o con una bandera de cancelacion controlada.

### Paginas legales y about/contact

- El shell comun vive en [src/components/legal/LegalPage.tsx](F:/_PROYECTOS/x-studio/src/components/legal/LegalPage.tsx).
- El contenido se gestiona desde el namespace `legal` en:
  - [src/locales/es-ES/legal.json](F:/_PROYECTOS/x-studio/src/locales/es-ES/legal.json)
  - [src/locales/en-US/legal.json](F:/_PROYECTOS/x-studio/src/locales/en-US/legal.json)
- Rutas activas:
  - `/privacy`
  - `/terms`
  - `/cookies`
  - `/contact`
- La home enlaza estas rutas desde el footer para que siempre exista salida publica a informacion legal y a la pagina de contacto/about.

## Billing y Stripe

### Arquitectura

- Stripe gestiona Checkout alojado, Customer Portal, recibos e invoices.
- Convex es la fuente de verdad para packs, clientes de billing, compras y ledger de creditos.
- Las piezas base viven en:
  - [src/lib/billing.ts](F:/_PROYECTOS/x-studio/src/lib/billing.ts)
  - [src/lib/stripe.ts](F:/_PROYECTOS/x-studio/src/lib/stripe.ts)
  - [src/lib/billing-server.ts](F:/_PROYECTOS/x-studio/src/lib/billing-server.ts)
  - [convex/billing.ts](F:/_PROYECTOS/x-studio/convex/billing.ts)

### Catalogo actual

- `trail-10`: 5 EUR por 10 creditos
- `studio-30`: 15 EUR por 30 creditos
- `orbit-100`: 30 EUR por 100 creditos
- Los slugs son estables y enlazan pricing, checkout, confirmacion y ledger.

### Tablas de Convex

- `billing_packs`: definicion interna y referencias Stripe
- `billing_customers`: relacion usuario <-> `stripe_customer_id`
- `billing_purchases`: compras, estados finales y enlaces de recibo/factura
- `billing_events`: eventos Stripe procesados para deduplicacion
- `credit_transactions`: ledger real de creditos

### Flujo de compra

- Pricing publica:
  - [src/app/pricing/page.tsx](F:/_PROYECTOS/x-studio/src/app/pricing/page.tsx)
  - [src/components/billing/PricingPageClient.tsx](F:/_PROYECTOS/x-studio/src/components/billing/PricingPageClient.tsx)
- Checkout:
  - [src/app/api/stripe/checkout/route.ts](F:/_PROYECTOS/x-studio/src/app/api/stripe/checkout/route.ts)
- Antes de crear la sesion se asegura:
  - catalogo por defecto en Convex
  - usuario Convex
  - `stripe_customer_id`
  - `stripe_price_id` del pack
- Cada checkout se registra primero como compra pendiente.

### Confirmacion y sincronizacion

- La compra se confirma por dos vias:
  - webhook en [src/app/api/stripe/webhook/route.ts](F:/_PROYECTOS/x-studio/src/app/api/stripe/webhook/route.ts)
  - confirmacion post redirect en [src/app/api/stripe/confirm/route.ts](F:/_PROYECTOS/x-studio/src/app/api/stripe/confirm/route.ts)
- Esta doble via permite validar compras locales aunque no exista webhook publico expuesto.
- La sincronizacion del catalogo vive en `syncStripeCatalog()` dentro de [src/lib/billing-server.ts](F:/_PROYECTOS/x-studio/src/lib/billing-server.ts).

### Seguridad interna

- Las mutaciones sensibles de Convex para Stripe usan `STRIPE_INTERNAL_SECRET`.
- Ese secreto permite que rutas server-side de Stripe escriban en Convex sin depender de funciones internas no accesibles via `ConvexHttpClient`.
- La sincronizacion admin via [src/app/api/stripe/sync/route.ts](F:/_PROYECTOS/x-studio/src/app/api/stripe/sync/route.ts) exige sesion Clerk valida y email admin.

### Superficies de producto

- Usuario:
  - `/pricing`
  - `/billing`
  - `/billing/success`
  - Customer Portal de Stripe
- Admin:
  - [src/components/admin/BillingAdminPanel.tsx](F:/_PROYECTOS/x-studio/src/components/admin/BillingAdminPanel.tsx)
  - integrado en [src/app/admin/page.tsx](F:/_PROYECTOS/x-studio/src/app/admin/page.tsx)

### Rutas publicas relacionadas

- `/pricing` debe seguir marcada como publica en [src/proxy.ts](F:/_PROYECTOS/x-studio/src/proxy.ts).
- `/api/stripe/webhook` tambien debe seguir publica para que Stripe entregue eventos.

## Referral program

### Architecture

- Referral attribution is persisted in Convex and not inferred from transient checkout metadata.
- User codes live on `users.referral_code`.
- Referral relationships live on `referrals`.
- Granted and reversed rewards live on `referral_rewards`.
- Credits are always reflected in the existing `credit_transactions` ledger.

### Runtime flow

1. A shared client tracker captures `?ref=` and stores it locally.
2. Once the invited user authenticates with Clerk, `/api/referrals/claim` resolves the real authenticated user and claims the code securely.
3. The referrer receives a fixed signup reward from `app_settings.referral_signup_reward_credits`.
4. When the referred user completes a paid Stripe checkout, `finalizeCheckoutSecure` grants the referrer a percentage of purchased credits using `app_settings.referral_purchase_reward_percentage`.
5. If that purchase is refunded, the referral bonus is reversed from the referrer to keep the ledger coherent.

### Admin knobs

- `referral_signup_reward_credits`
- `referral_purchase_reward_percentage`

These values are editable from Admin and must remain the single source of truth for referral rewards.
