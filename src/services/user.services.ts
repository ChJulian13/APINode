import { UserRepository } from '../repositories/user.repository.js';
import { type CreateUserDTO, type LoginUserDTO, type UserResponseDTO, type AuthResponseDTO } from '../domain/user.domain.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
    // 1. Verificamos si existe (Usando la consulta SELECT del repo)
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) {
      throw new Error('EMAIL_ALREADY_IN_USE');
    }

    // 2. Encriptamos
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 3. Guardamos (Usando la consulta INSERT del repo)
    const newUser = await this.userRepository.save({
      ...data,
      password: hashedPassword,
    });

    // 4. Formateamos salida
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    
    return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
    }));
  }

  async loginUser(data: LoginUserDTO): Promise<AuthResponseDTO> {
    // 1. Buscar al usuario por correo usando el método que ya teníamos en el Repositorio
    const user = await this.userRepository.findByEmail(data.email);
    
    // Si no existe, lanzamos error genérico
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 2. Verificar si la contraseña en texto plano coincide con el Hash guardado en MySQL
    const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 3. Generar el Pasaporte (JWT)
    // El payload (los datos adentro del token) no debe tener información sensible (ej. nunca pongas contraseñas ahí)
    const payload = { 
      id: user.id, 
      email: user.email 
    };

    const secret = process.env.JWT_SECRET || 'secreto_por_defecto_si_falla_env';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

    // 4. Devolver la información limpia y el token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    };
  }
}