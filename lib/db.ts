import mysql from 'mysql2/promise';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL is not set. MySQL client will fail to connect.');
}

export const pool = mysql.createPool({
  uri: databaseUrl,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}
