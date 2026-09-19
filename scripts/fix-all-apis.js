const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('app/api');
for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (code.includes("const merchantId = request.headers.get('x-merchant-id') || '00000000-0000-0000-0000-000000000001';")) {
    code = code.replace(/const merchantId = request\.headers\.get\('x-merchant-id'\) \|\| '00000000-0000-0000-0000-000000000001';/g, 
      "let merchantId = request.headers.get('x-merchant-id') || '00000000-0000-0000-0000-000000000001';\n    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;\n    if (!uuidRegex.test(merchantId)) {\n      merchantId = '00000000-0000-0000-0000-000000000001';\n    }");
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, code);
    console.log("Fixed UUID logic in:", file);
  }
}
