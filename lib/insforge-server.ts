import { createAdminClient } from '@insforge/sdk';
import 'server-only';

if (!process.env.INSFORGE_BASE_URL || !process.env.INSFORGE_SERVICE_ROLE_KEY) {
  throw new Error('Missing InsForge configuration in environment');
}

export const insforge = createAdminClient({
  baseUrl: process.env.INSFORGE_BASE_URL,
  apiKey: process.env.INSFORGE_SERVICE_ROLE_KEY
});
