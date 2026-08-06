declare global {
  interface Window {
    turnstile?: {
      execute: (widget: string | HTMLElement) => void;
      reset: (widget: string | HTMLElement) => void;
    };
  }
}

const posthogKey = import.meta.env.PUBLIC_POSTHOG_KEY;
let capture = (_eventName?: string, _properties?: Record<string, string>) => {};

// Static Assets don't hit middleware when run_worker_first is only `/api/*`.
// Bounce www → apex in the client so forms and Turnstile always run on the canonical host.
const onWww = window.location.hostname === 'www.queestanconstruyendo.com';
if (onWww) {
  const apex = new URL(window.location.href);
  apex.hostname = 'queestanconstruyendo.com';
  window.location.replace(apex.href);
}

const sharedTurnstile = onWww ? null : document.querySelector<HTMLElement>('[data-turnstile]');

const readTurnstileToken = () =>
  document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value || '';

const waitForTurnstileToken = async () => {
  for (let attempt = 0; attempt < 3_000; attempt += 1) {
    const token = readTurnstileToken();
    if (token) return token;
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  throw new Error('La verificación anti-spam venció.');
};

const waitForTurnstileApi = async () => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (window.turnstile && sharedTurnstile) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }

  throw new Error('La verificación anti-spam no está disponible.');
};

const obtainTurnstileToken = async () => {
  await waitForTurnstileApi();
  if (!sharedTurnstile || !window.turnstile) {
    throw new Error('La verificación anti-spam no está disponible.');
  }

  const existing = readTurnstileToken();
  if (existing) return existing;

  window.turnstile.execute(sharedTurnstile);
  return waitForTurnstileToken();
};

const bindForms = () => {
  document.querySelectorAll<HTMLFormElement>('[data-qec-form]').forEach((form) => {
    let started = false;
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const endpoint = form.getAttribute('action') || '/';
    const analyticsProperties = {
      form: form.dataset.qecForm || 'unknown',
      source: form.querySelector<HTMLInputElement>('[name="source"]')?.value || window.location.pathname,
    };

    form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      capture(form.dataset.startEvent, analyticsProperties);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!status || !button) return;

      const idleLabel = button.textContent || 'Enviar';
      button.disabled = true;
      status.dataset.state = 'loading';

      try {
        button.textContent = 'Verificando...';
        status.textContent = 'Estamos validando la verificación anti-spam.';
        const turnstileToken = await obtainTurnstileToken();

        button.textContent = button.dataset.loadingLabel || 'Enviando...';
        status.textContent = 'Estamos procesando tu envío.';
        const values: Record<string, FormDataEntryValue | boolean> = Object.fromEntries(new FormData(form));
        values.consent = form.querySelector<HTMLInputElement>('[name="consent"]')?.checked ?? false;
        values['cf-turnstile-response'] = turnstileToken;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const isJson = response.headers.get('Content-Type')?.includes('application/json');
        const result = isJson ? await response.json() as { message?: string } : {};

        if (response.status === 429) {
          throw new Error('Recibimos demasiados envíos desde esta conexión. Esperá un minuto.');
        }

        if (!response.ok) throw new Error(result.message || 'No pudimos procesar el envío.');

        status.dataset.state = 'success';
        status.textContent = result.message || 'Listo. Gracias por participar.';
        capture(form.dataset.completeEvent, analyticsProperties);
        form.reset();
        started = false;
      } catch (error) {
        status.dataset.state = 'error';
        status.textContent = error instanceof Error
          ? `${error.message} Probá nuevamente.`
          : 'No pudimos procesar el envío. Probá nuevamente.';
      } finally {
        if (sharedTurnstile) window.turnstile?.reset(sharedTurnstile);
        button.disabled = false;
        button.textContent = idleLabel;
      }
    });
  });
};

if (!onWww) {
  bindForms();

  void import('posthog-js').then(({ default: posthog }) => {
    if (!posthogKey) return;

    try {
      posthog.init(posthogKey, {
        api_host: import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        ui_host: 'https://us.posthog.com',
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        person_profiles: 'never',
        persistence: 'memory',
      });

      capture = (eventName?: string, properties?: Record<string, string>) => {
        if (eventName) posthog.capture(eventName, properties);
      };

      capture('$pageview', {
        path: window.location.pathname,
        referrer: document.referrer,
      });
      capture(document.body.dataset.pageEvent, { path: window.location.pathname });
    } catch (error) {
      console.warn('PostHog no pudo inicializarse', error);
    }
  }).catch((error) => {
    console.warn('PostHog no pudo cargarse', error);
  });
}
