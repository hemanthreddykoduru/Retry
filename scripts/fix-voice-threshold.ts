import fs from 'fs';
const path = 'app/api/recovery-cases/[id]/voice-call/route.ts';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(
  "const voiceThresholdPaise = merchantRes[0]?.voice_call_threshold || 50000;",
  "const voiceThresholdPaise = merchantRes[0]?.voice_call_threshold ?? 50000;"
);
fs.writeFileSync(path, code);
