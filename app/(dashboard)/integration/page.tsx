"use client";
import { useEffect, useState } from "react";
import IntegrationClient from './client';

export default function IntegrationPage() {
  const [apiKey, setApiKey] = useState('m_demo_123');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const merchantId = localStorage.getItem('retry_merchant_id');
      if (merchantId) {
        setApiKey(merchantId);
      }
    }
  }, []);
  
  let appUrl = 'http://localhost:3000';
  if (process.env.NEXT_PUBLIC_APP_URL) {
    appUrl = process.env.NEXT_PUBLIC_APP_URL;
  }
  
  return <IntegrationClient apiKey={apiKey} appUrl={appUrl} />;
}
