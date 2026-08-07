# Qué Están Construyendo

Landing, archivo editorial y newsletter quincenal para QEC. El MVP usa archivos Markdown como contenido, Resend para contactos y correo, PostHog para eventos web y React Email para la plantilla responsive.

## Stack

- Astro 7
- Vite 8
- Tailwind CSS 4
- React Email 6
- Resend
- PostHog
- Cloudflare Workers
- pnpm

## Desarrollo

1. Copiá `.env.example` como `.env` y completá las variables.
2. Ejecutá `pnpm dev` para la web.
3. Ejecutá `pnpm email:dev` para previsualizar `src/emails/issue-zero.tsx`.
4. Ejecutá `pnpm types`, `pnpm check` y `pnpm build` antes de desplegar.

Durante el desarrollo local, Turnstile usa las credenciales de prueba oficiales de Cloudflare. Los builds de producción siempre requieren `TURNSTILE_SECRET_KEY` y usan la site key real.

## Despliegue

- `pnpm deploy` publica el sitio y sus endpoints en Cloudflare Workers.
- Producción usa `https://queestanconstruyendo.com`; `workers.dev` y las preview URLs permanecen desactivadas.
- El Worker corre primero solo en `/api/*` (`assets.run_worker_first`); el resto lo sirven Static Assets.
- El middleware redirige `www` → apex salvo en `/api/*` (un redirect ahí rompe el CORS del `fetch` del formulario). Las páginas en `www` también rebotan al apex desde el cliente.
- `SITE_URL` debe coincidir con el hostname publicado antes de construir para generar canonicales y sitemap correctos.
- Las variables privadas de Resend deben cargarse como Worker Secrets; nunca se incluyen en `wrangler.jsonc`.
- La site key pública de Turnstile vive en `src/components/Turnstile.astro`; su secreto nunca se incluye en el repositorio.

### Variables en Cloudflare

En **Workers & Pages > qec > Settings > Variables and Secrets**, cargar como **Secrets**:

- `RESEND_API_KEY`
- `RESEND_FROM`
- `RESEND_REPLY_TO`
- `QEC_EDITOR_EMAIL`
- `TURNSTILE_SECRET_KEY`

Sin esos secretos los formularios quedan intencionalmente deshabilitados y responden `503`. No usar variables públicas ni `wrangler.jsonc` para valores de Resend.

Si el despliegue se configura con Git mediante **Workers Builds**, cargar en **Workers & Pages > qec > Settings > Builds > Environment variables**:

- `SITE_URL`
- `PUBLIC_CONTACT_EMAIL`
- `PUBLIC_POSTHOG_KEY`
- `PUBLIC_POSTHOG_HOST`

Estas últimas son variables de build: `SITE_URL` genera canonicales y sitemap; los valores `PUBLIC_*` se compilan en el frontend y no pueden contener secretos.

`pnpm build` regenera `public/_headers` con el origen HTTPS de `PUBLIC_POSTHOG_HOST`, de modo que la CSP de Static Assets coincida con la aplicada por el middleware. No edites ese archivo manualmente.

## Contenido

Las ediciones viven en `src/content/issues/` y se validan con `src/content.config.ts`. La edición cero es una demostración explícita y no contiene noticias reales.

La automatización para generar web y email desde una única fuente queda deliberadamente fuera de esta primera versión. La plantilla de email acepta los datos de una edición mediante props y está preparada para recibirlos cuando el flujo editorial se estabilice.

## Resend

- `POST /api/subscribe` crea un contacto en el único listado de Resend.
- `POST /api/submit-story` envía una novedad a `QEC_EDITOR_EMAIL`.
- `POST /api/feedback` envía feedback de una edición al mismo buzón.
- Los tres endpoints validan Turnstile y limitan cada identidad validada a cinco intentos por minuto y acción.
- El dominio usado por `RESEND_FROM` debe estar verificado en Resend.
- Los envíos reales deben pasar `replyTo`, una URL de baja válida y los headers de baja de Resend. La plantilla solo muestra el enlace de baja cuando recibe una URL real; nunca genera una dirección ficticia.

## PostHog

La web emite eventos de página, conversión y errores de formulario:

**Vistas de página**

- `$pageview` — todas las rutas (una vez por carga de documento)
- `landing_viewed` — home (`/`)
- `archive_viewed` — archivo (`/ediciones/`)
- `issue_viewed` — edición individual (`/ediciones/[id]/`)
- `privacy_viewed` — privacidad (`/privacidad/`)

**Formularios**

- `subscription_started` / `subscription_completed`
- `story_submission_started` / `story_submitted`
- `feedback_started` / `feedback_submitted`
- `form_error` — fallos de validación, Turnstile o API (props: `form`, `source`, `error_type`, `status`; sin PII)

**Propiedades comunes**

- `$host`, `$pathname` en pageviews
- `form` y `source` en eventos de formulario

**Operación**

- Dashboard operativo: [QEC — Operación semanal](https://us.posthog.com/project/242530/dashboard/1969876) (revisar a los 7 días de cada edición)
- PostHog filtra tráfico interno y de preview (`localhost`, `127.0.0.1`, hosts `*.workers.dev` y `*.pages.dev`); los insights nuevos excluyen test users por defecto
- Métricas de email (opens, clics, rebotes) siguen en Resend, no en PostHog
- Rotar la API key personal del MCP si se expuso; preferir OAuth en Cursor o una key con scope MCP en [User API keys](https://us.posthog.com/settings/user-api-keys)
- Preview de Cloudflare se separa por `$host` en eventos y por filtros de test users en PostHog

La configuración inicial es anónima, sin perfiles persistentes ni grabación de sesiones.
