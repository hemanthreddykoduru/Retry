import { MerchantsRepository } from '@/lib/repositories/merchants';
import IntegrationClient from './client';

export default async function IntegrationPage() {
  const merchantId = '00000000-0000-0000-0000-000000000001';
  const merchant = await MerchantsRepository.get(merchantId);

  // If no merchant is found, fallback to the demo key for safety
  const apiKey = merchant?.api_key || 'm_demo_123';

  return <IntegrationClient apiKey={apiKey} />;
}
