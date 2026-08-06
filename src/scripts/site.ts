import posthog from 'posthog-js';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        action?: string;
        theme: 'light' | 'dark';
        size: 'flexible';
      }) => string;
      reset: (widgetId: string) => void;
    };
    turnstileReady?: boolean;
  }
}

const posthogKey = import.meta.env.PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    person_profiles: 'never',
    persistence: 'memory',
  });
}

const capture = (eventName?: string, properties?: Record<string, string>) => {
  if (posthogKey && eventName) posthog.capture(eventName, properties);
};

capture(document.body.dataset.pageEvent);

const renderTurnstileWidgets = () => {
  const turnstile = window.turnstile;
  if (!turnstile) return;

  document.querySelectorAll<HTMLElement>('[data-turnstile]').forEach((container) => {
    if (container.dataset.widgetId || !container.dataset.sitekey) return;

    container.dataset.widgetId = turnstile.render(container, {
      sitekey: container.dataset.sitekey,
      action: container.dataset.action,
      theme: container.dataset.theme === 'dark' ? 'dark' : 'light',
      size: 'flexible',
    });
  });
};

if (window.turnstileReady) {
  renderTurnstileWidgets();
} else {
  window.addEventListener('turnstile-ready', renderTurnstileWidgets, { once: true });
}

document.querySelectorAll<HTMLFormElement>('[data-qec-form]').forEach((form) => {
  let started = false;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const turnstileContainer = form.querySelector<HTMLElement>('[data-turnstile]');

  form.addEventListener('focusin', () => {
    if (started) return;
    started = true;
    capture(form.dataset.startEvent);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!status || !button) return;

    const turnstileToken = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value;
    if (!turnstileToken) {
      status.dataset.state = 'error';
      status.textContent = 'Completá la verificación anti-spam antes de enviar.';
      return;
    }

    const idleLabel = button.textContent || 'Enviar';
    button.disabled = true;
    button.textContent = button.dataset.loadingLabel || 'Enviando...';
    status.dataset.state = 'loading';
    status.textContent = 'Estamos procesando tu envío.';

    const values: Record<string, FormDataEntryValue | boolean> = Object.fromEntries(new FormData(form));
    values.consent = form.querySelector<HTMLInputElement>('[name="consent"]')?.checked ?? false;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const isJson = response.headers.get('Content-Type')?.includes('application/json');
      const result = isJson ? await response.json() as { message?: string } : {};

      if (response.status === 429) {
        throw new Error('Recibimos demasiados envíos desde esta conexión. Esperá unos segundos.');
      }

      if (!response.ok) throw new Error(result.message || 'No pudimos procesar el envío.');

      status.dataset.state = 'success';
      status.textContent = result.message || 'Listo. Gracias por participar.';
      capture(form.dataset.completeEvent);
      form.reset();
      started = false;
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error instanceof Error
        ? `${error.message} Probá nuevamente.`
        : 'No pudimos procesar el envío. Probá nuevamente.';
    } finally {
      const widgetId = turnstileContainer?.dataset.widgetId;
      if (widgetId) window.turnstile?.reset(widgetId);
      button.disabled = false;
      button.textContent = idleLabel;
    }
  });
});
