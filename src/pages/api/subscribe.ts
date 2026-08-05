import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { cleanText, isEmail, jsonResponse } from '../../lib/forms';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return jsonResponse({ message: 'El formulario no tiene un formato válido.' }, 400);
  if (cleanText(body.company, 100)) return jsonResponse({ message: 'Revisá tu casilla para continuar.' });

  const email = cleanText(body.email, 180).toLowerCase();
  if (!isEmail(email)) return jsonResponse({ message: 'Ingresá un email válido.' }, 400);
  if (body.consent !== true) return jsonResponse({ message: 'Necesitamos tu consentimiento para suscribirte.' }, 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return jsonResponse({ message: 'La suscripción todavía no está conectada a Resend.' }, 503);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.contacts.create({
    email,
    unsubscribed: false,
  });

  if (error) return jsonResponse({ message: error.message }, 400);

  return jsonResponse({
    id: data?.id,
    message: 'Ya estás en la lista. Vas a recibir la próxima edición.',
  }, 201);
};
