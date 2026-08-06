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

## Despliegue

- `pnpm deploy` publica el sitio y sus endpoints en Cloudflare Workers.
- Producción usa `https://queestanconstruyendo.com`; `workers.dev` y las preview URLs permanecen desactivadas.
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

## Contenido

Las ediciones viven en `src/content/issues/` y se validan con `src/content.config.ts`. La edición cero es una demostración explícita y no contiene noticias reales.

La automatización para generar web y email desde una única fuente queda deliberadamente fuera de esta primera versión. La plantilla de email acepta los datos de una edición mediante props y está preparada para recibirlos cuando el flujo editorial se estabilice.

## Resend

- `POST /api/subscribe` crea un contacto en el único listado de Resend.
- `POST /api/submit-story` envía una novedad a `QEC_EDITOR_EMAIL`.
- `POST /api/feedback` envía feedback de una edición al mismo buzón.
- El dominio usado por `RESEND_FROM` debe estar verificado en Resend.
- Los envíos reales deben pasar `replyTo`, una URL de baja válida y los headers de baja de Resend. La plantilla ya muestra Reply-To y el enlace obligatorio en el footer.

## PostHog

La web emite los seis eventos definidos por el MVP:

- `landing_viewed`
- `subscription_started`
- `subscription_completed`
- `story_submission_started`
- `story_submitted`
- `feedback_submitted`

La configuración inicial es anónima, sin perfiles persistentes ni grabación de sesiones.
