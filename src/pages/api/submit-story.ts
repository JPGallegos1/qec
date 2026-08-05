import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { cleanText, isEmail, isWebUrl, jsonResponse } from '../../lib/forms';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return jsonResponse({ message: 'El formulario no tiene un formato válido.' }, 400);
  if (cleanText(body.role, 100)) return jsonResponse({ message: 'Recibimos tu novedad. Gracias.' });

  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 180).toLowerCase();
  const project = cleanText(body.project, 120);
  const category = cleanText(body.category, 30);
  const url = cleanText(body.url, 500);
  const summary = cleanText(body.summary, 1200);
  const validCategories = ['startup', 'indie', 'video', 'other'];

  if (!name || !project || !summary || !isEmail(email) || !isWebUrl(url) || !validCategories.includes(category)) {
    return jsonResponse({ message: 'Revisá los campos y la URL de la fuente original.' }, 400);
  }
  if (body.consent !== true) return jsonResponse({ message: 'Necesitamos tu consentimiento para evaluar el envío.' }, 400);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.RESEND_FROM;
  const editorEmail = import.meta.env.QEC_EDITOR_EMAIL;
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

  if (error) return jsonResponse({ message: error.message }, 400);

  return jsonResponse({
    id: data?.id,
    message: 'Recibimos tu novedad. La vamos a revisar a mano.',
  }, 201);
};
