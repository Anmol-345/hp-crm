const fs = require('fs');
const path = require('path');
const https = require('https');

const token = process.env.SUPABASE_ACCESS_TOKEN || '';
const projectRef = 'hwyzyzehewwwyvfbposd';

async function runQuery(sql, label) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${projectRef}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✓ ${label} applied successfully (Status ${res.statusCode})`);
          resolve(body);
        } else {
          console.error(`✗ ${label} failed (Status ${res.statusCode}):`, body);
          reject(new Error(body));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const files = ['0001_schema.sql', '0002_rls.sql', '0003_seed.sql'];

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Applying ${file}...`);
    await runQuery(sql, file);
  }

  console.log('All migrations applied successfully!');
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});

