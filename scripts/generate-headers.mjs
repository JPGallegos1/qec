import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { serializeStaticHeaders } from '../src/lib/security-headers.mjs';

const headersUrl = new URL('../public/_headers', import.meta.url);

await writeFile(
  fileURLToPath(headersUrl),
  serializeStaticHeaders(process.env.PUBLIC_POSTHOG_HOST),
  'utf8',
);
