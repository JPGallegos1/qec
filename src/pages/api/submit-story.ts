import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { cleanText, isEmail, isSameOrigin, isWebUrl, jsonResponse, readJsonBody, safeText, verifyTurnstile } from '../../lib/forms';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOrigin(request)) return jsonResponse({ message: 'No pudimos validar el origen del formulario.' }, 403);
  const parsed = await readJsonBody(request);
  if ('response' in parsed) return parsed.response;
  const { body } = parsed;
  if (cleanText(body.role, 100)) return jsonResponse({ message: 'Recibimos tu novedad. Gracias.' });

  const name = safeText(body.name, 80);
  const email = safeText(body.email, 180).toLowerCase();
  const project = safeText(body.project, 120);
  const category = safeText(body.category, 30);
  const url = safeText(body.url, 500);
  const summary = safeText(body.summary, 1200, true);
  const validCategories = ['startup', 'indie', 'video', 'other'];

  if (!name || !project || !summary || !isEmail(email) || !isWebUrl(url) || !validCategories.includes(category)) {
    return jsonResponse({ message: 'Revisá los campos y la URL de la fuente original.' }, 400);
  }
  if (body.consent !== true) return jsonResponse({ message: 'Necesitamos tu consentimiento para evaluar el envío.' }, 400);

  const turnstileError = await verifyTurnstile(request, body['cf-turnstile-response'], 'submit-story');
  if (turnstileError) return turnstileError;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const editorEmail = process.env.QEC_EDITOR_EMAIL;
  if (!apiKey || !from || !editorEmail) {
    return jsonResponse({ message: 'El buzón editorial todavía no está configurado.' }, 503);
  }

  const resend = new Resend(apiKey);
  const fingerprint = createHash('sha256').update(`${email}|${url}|${summary}`).digest('hex').slice(0, 32);
  const { data, error } = await resend.emails.send({
    from,
    to: editorEmail,
    replyTo: email,
    subject: `[QEC] Nueva señal: ${project}`,
    text: [
      `Enviado por: ${name} <${email}>`,
      `Proyecto: ${project}`,
      `Categoría: ${category}`,
      `Fuente: ${url}`,
      '',
      summary,
    ].join('\n'),
    tags: [{ name: 'form', value: 'story-submission' }],
  }, { idempotencyKey: `story-submission/${fingerprint}` });

  if (error) {
    console.error('Resend story submission failed', error);
    return jsonResponse({ message: 'No pudimos enviar la novedad en este momento.' }, 502);
  }

  return jsonResponse({
    id: data?.id,
    message: 'Recibimos tu novedad. La vamos a revisar a mano.',
  }, 201);
};
