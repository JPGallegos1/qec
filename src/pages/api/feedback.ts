import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { cleanText, isEmail, jsonResponse } from '../../lib/forms';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return jsonResponse({ message: 'El formulario no tiene un formato válido.' }, 400);
  if (cleanText(body.company, 100)) return jsonResponse({ message: 'Gracias por responder.' });

  const issue = cleanText(body.issue, 80);
  const email = cleanText(body.email, 180).toLowerCase();
  const message = cleanText(body.message, 800);
  if (!issue || !message || (email && !isEmail(email))) {
    return jsonResponse({ message: 'Revisá el mensaje y el email.' }, 400);
  }

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

  if (error) return jsonResponse({ message: error.message }, 400);

  return jsonResponse({ id: data?.id, message: 'Gracias. Tu respuesta llegó a la mesa editorial.' }, 201);
};
