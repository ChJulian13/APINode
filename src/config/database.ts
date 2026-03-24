import mysql from 'mysql2/promise';
import { env } from './env.js'

// Creamos el Pool de conexiones
export const pool = mysql.createPool({
  host: env.DB_HOST || 'localhost',
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD || '',
  database: env.DB_NAME || 'api_usuarios',
  waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones concurrentes
  queueLimit: 0
});