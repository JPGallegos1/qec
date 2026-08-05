# Qué Están Construyendo

Landing, archivo editorial y newsletter quincenal para QEC. El MVP usa archivos Markdown como contenido, Resend para contactos y correo, PostHog para eventos web y React Email para la plantilla responsive.

## Stack

- Astro 7
- Vite 8
- Tailwind CSS 4
- React Email 6
- Resend
- PostHog
- pnpm

## Desarrollo

1. Copiá `.env.example` como `.env` y completá las variables.
2. Ejecutá `pnpm dev` para la web.
3. Ejecutá `pnpm email:dev` para previsualizar `src/emails/issue-zero.tsx`.
4. Ejecutá `pnpm check` y `pnpm build` antes de desplegar.

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
