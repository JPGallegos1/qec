import posthog from 'posthog-js';

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

document.querySelectorAll<HTMLFormElement>('[data-qec-form]').forEach((form) => {
  let started = false;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  form.addEventListener('focusin', () => {
    if (started) return;
    started = true;
    capture(form.dataset.startEvent);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!status || !button) return;

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
      const result = await response.json() as { message?: string };

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
      button.disabled = false;
      button.textContent = idleLabel;
    }
  });
});
