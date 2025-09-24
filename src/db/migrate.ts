import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pool } from './pool';

async function run() {
  const sqlPath = resolve(__dirname, 'migrations.sql');
  const sql = readFileSync(sqlPath, 'utf-8');
  await pool.query(sql);
  console.log('Migrations applied');
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});


