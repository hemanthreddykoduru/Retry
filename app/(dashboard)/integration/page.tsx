import { MerchantsRepository } from '@/lib/repositories/merchants';
import IntegrationClient from './client';

export default async function IntegrationPage() {
  const merchantId = '00000000-0000-0000-0000-000000000001';
  const merchant = await MerchantsRepository.get(merchantId);

  // If no merchant is found, fallback to the demo key for safety
  const apiKey = merchant?.api_key || 'm_demo_123';
  
  let appUrl = 'http://localhost:3000';
  if (process.env.NEXT_PUBLIC_APP_URL) {
    appUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else if (process.env.VERCEL_URL) {
    appUrl = `https://${process.env.VERCEL_URL}`;
  }

  return <IntegrationClient apiKey={apiKey} appUrl={appUrl} />;
}
