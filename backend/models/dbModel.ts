require('dotenv').config();
const { Pool } = require('pg');

// create a new pool here using the connection string above
let pool: typeof Pool | undefined;

function createPool(connectionString: string | undefined): void {
  if (pool) {
    pool.end(); // Close existing pool connections
  }
  pool = new Pool({
    connectionString
  });
}

function getPool(): typeof Pool {
  if (!pool) { throw new Error('Database pool has not been initialized.'); }
  return pool;
}

// Initial pool setup
createPool(process.env.SUPABASE_URI);

module.exports = {
  query: (text: string, params: string[]) => {
    console.log('executed query', text);
    return getPool().query(text, params);
  },
  updateConnectionString: (newConnectionString: string) => {
    createPool(newConnectionString);
  }
};