import { createClient } from '@insforge/sdk';
const insforge = createClient({
  baseUrl: process.env.INSFORGE_BASE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
});
async function run() {
  const { data, error } = await insforge.auth.verifyEmail({
    email: 'fake@example.com',
    otp: '123456'
  });
  console.log("verifyEmail:", { data, error });
  
  const { data: data2, error: error2 } = await insforge.auth.verifyOtp({
    email: 'fake@example.com',
    otp: '123456'
  });
  console.log("verifyOtp:", { data: data2, error: error2 });
}
run();
