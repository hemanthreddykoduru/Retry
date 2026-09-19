import fs from 'fs';
const webhookPath = 'app/api/webhooks/razorpay/route.ts';
let code = fs.readFileSync(webhookPath, 'utf8');
code = code.replace(
  "const delayMinutes = parseInt(policies.delayMinutes || '15', 10);",
  "const delayMinutes = parseInt(policies.delayMinutes ?? '15', 10);"
);
fs.writeFileSync(webhookPath, code);

const guardrailsPath = 'lib/guardrails.ts';
let guardrailsCode = fs.readFileSync(guardrailsPath, 'utf8');
guardrailsCode = guardrailsCode.replace(
  "const coolOffMinutes = parseInt(merchantPolicies.delayMinutes || '15', 10);",
  "const coolOffMinutes = parseInt(merchantPolicies.delayMinutes ?? '15', 10);"
);
fs.writeFileSync(guardrailsPath, guardrailsCode);
