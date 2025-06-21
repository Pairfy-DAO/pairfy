import mysql from 'mysql2/promise';
import { loadSql } from '@pairfy/common';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
  console.error("❌ Missing one or more required environment variables.");
  process.exit(1);
}

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: DATABASE_HOST,
      port: Number(DATABASE_PORT) || 3306,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      multipleStatements: true,
    });

    console.log("✅ Connected to MySQL server");

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE_NAME}\`;`);
    await connection.query(`USE \`${DATABASE_NAME}\`;`);
    console.log(`✅ Database '${DATABASE_NAME}' verified and selected.`);

    const sqlFiles: string[] = ['events.sql', 'processed.sql', 'products.sql', 'sellers.sql', 'orders.sql', 'books.sql' ];

    for (const file of sqlFiles) {
      console.log(`📄 Executing ${file}...`);
      const sql = loadSql(file);
      await connection.query(sql);
      console.log(`✅ ${file} executed successfully.`);
    }

    await connection.end();
    console.log("🚪 Connection closed.");
  } catch (err) {
    console.error("❌ Error during setup:", (err as Error).message);
    process.exit(1);
  }
})();
