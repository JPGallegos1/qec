import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { cleanText, isEmail, isSameOrigin, jsonResponse, readJsonBody, safeText, verifyTurnstile } from '../../lib/forms';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOrigin(request)) return jsonResponse({ message: 'No pudimos validar el origen del formulario.' }, 403);
  const parsed = await readJsonBody(request);
  if ('response' in parsed) return parsed.response;
  const { body } = parsed;
  if (cleanText(body.company, 100)) return jsonResponse({ message: 'Gracias por responder.' });

  const issue = safeText(body.issue, 80);
  const email = safeText(body.email, 180).toLowerCase();
  const message = safeText(body.message, 800, true);
  if (!issue || !message || (email && !isEmail(email))) {
    return jsonResponse({ message: 'Revisá el mensaje y el email.' }, 400);
  }

  const turnstileError = await verifyTurnstile(request, body['cf-turnstile-response'], 'feedback');
  if (turnstileError) return turnstileError;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const replyTo = email || process.env.RESEND_REPLY_TO;
  const editorEmail = process.env.QEC_EDITOR_EMAIL;
  if (!apiKey || !from || !replyTo || !editorEmail) {
    return jsonResponse({ message: 'El buzón de feedback todavía no está configurado.' }, 503);
  }

  const resend = new Resend(apiKey);
  const fingerprint = createHash('sha256').update(`${issue}|${email}|${message}`).digest('hex').slice(0, 32);
  const { data, error } = await resend.emails.send({
    from,
    to: editorEmail,
    replyTo,
    subject: `[QEC] Feedback sobre ${issue}`,
    text: `Edición: ${issue}\nEmail: ${email || 'No informado'}\n\n${message}`,
    tags: [{ name: 'form', value: 'issue-feedback' }],
  }, { idempotencyKey: `issue-feedback/${fingerprint}` });

  if (error) {
    console.error('Resend feedback submission failed', error);
    return jsonResponse({ message: 'No pudimos enviar el feedback en este momento.' }, 502);
  }

  return jsonResponse({ id: data?.id, message: 'Gracias. Tu respuesta llegó a la mesa editorial.' }, 201);
};
