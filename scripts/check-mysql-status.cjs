const mysql = require('mysql2/promise');

async function inspect() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'smart_salon_db'
    });
    const tables = ['users', 'appointments', 'customers', 'salon_settings', 'inquiries', 'offers', 'reviews', 'notifications', 'broadcast_logs'];
    for (const t of tables) {
      try {
        const [cols] = await conn.query('DESCRIBE ' + t);
        console.log('\n=== ' + t + ' ===');
        console.log(cols.map(c => c.Field + ' (' + c.Type + ')').join(', '));
      } catch (e) {
        console.log('\n=== ' + t + ' === (not found or error: ' + e.message + ')');
      }
    }
    await conn.end();
  } catch (err) {
    console.error('Inspection error:', err.message);
  }
}

inspect();
