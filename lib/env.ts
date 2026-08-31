// Ensure this file is never imported in a client component
import "server-only";

export const env = {
  // App
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  DEMO_MODE: process.env.DEMO_MODE !== "false", // defaults to true

  // Razorpay
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,

  // InsForge
  INSFORGE_BASE_URL: process.env.INSFORGE_BASE_URL,
  INSFORGE_ANON_KEY: process.env.INSFORGE_ANON_KEY,
  INSFORGE_SERVICE_ROLE_KEY: process.env.INSFORGE_SERVICE_ROLE_KEY,

  // Sarvam
  SARVAM_MOCK_MODE: process.env.SARVAM_MOCK_MODE !== "false", // defaults to true
  SARVAM_API_KEY: process.env.SARVAM_API_KEY,
  SARVAM_AGENT_ID: process.env.SARVAM_AGENT_ID,
  SARVAM_API_BASE_URL: process.env.SARVAM_API_BASE_URL || "https://api.sarvam.ai/v1/outbound",
  SARVAM_WEBHOOK_SECRET: process.env.SARVAM_WEBHOOK_SECRET,
  SARVAM_OUTBOUND_PHONE_NUMBER_ID: process.env.SARVAM_OUTBOUND_PHONE_NUMBER_ID,

  // WhatsApp
  WHATSAPP_MOCK_MODE: process.env.WHATSAPP_MOCK_MODE !== "false", // defaults to true
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
};

function validateEnv() {
  if (!env.DEMO_MODE) {
    if (!env.RAZORPAY_KEY_SECRET) throw new Error("RAZORPAY_KEY_SECRET is required in live mode.");
    if (!env.RAZORPAY_WEBHOOK_SECRET) throw new Error("RAZORPAY_WEBHOOK_SECRET is required in live mode.");
    
    if (!env.SARVAM_MOCK_MODE) {
      if (!env.SARVAM_API_KEY) throw new Error("SARVAM_API_KEY is required when mock mode is off.");
      if (!env.SARVAM_AGENT_ID) throw new Error("SARVAM_AGENT_ID is required when mock mode is off.");
    }
  }
}

validateEnv();
