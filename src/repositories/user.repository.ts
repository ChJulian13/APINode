import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { type CreateUserDTO } from '../domain/user.domain.js';
import { randomUUID } from 'crypto';

// Definimos cómo luce una fila de la base de datos para TypeScript
interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export class UserRepository {
  
  async findByEmail(email: string): Promise<UserRow | null> {
    // El método execute() devuelve un array donde el primer elemento son las filas [rows]
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    
    return rows[0] ?? null;
  }

  async save(data: CreateUserDTO): Promise<any> {
    const id = randomUUID(); // Generamos el UUID en el backend
    const now = new Date();

    // Insertamos los datos de forma segura
    await pool.execute<ResultSetHeader>(
      'INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, data.name, data.email, data.password, now]
    );

    // Devolvemos el objeto tal y como sabemos que quedó en la BD
    return {
      id,
      name: data.name,
      email: data.email,
      createdAt: now
    };
  }

  async findAll(): Promise<UserRow[]> {
    const [rows] = await pool.execute<UserRow[]> (
        'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );

    return rows;
  }

  async update(id: string, name: string, email: string): Promise<void> {
    await pool.execute(
      'UPDATE users SET name =?, email = ? WHERE id = ?',
      [name, email, id]
    );
  }

  async findById(id: string): Promise<UserRow | null> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] ?? null;
  } 

  async delete(id: string) : Promise<void> {
    await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
  }
}