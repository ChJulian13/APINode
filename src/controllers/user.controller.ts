import { type Request, type Response } from 'express';
import { UserService } from '../services/user.services.js';
import { CreateUserSchema, LoginUserSchema } from '../domain/user.domain.js';
import { success } from 'zod';

export class UserController {
  constructor(private readonly userService: UserService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedData);

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente con Raw SQL',
        data: user,
      });

    } catch (error: any) {
      if (error.name === 'ZodError') {
         res.status(400).json({ success: false, errors: error.errors });
         return;
      }
      if (error.message === 'EMAIL_ALREADY_IN_USE') {
         res.status(409).json({ success: false, message: 'El correo ya está registrado' });
         return;
      }
      console.error(error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validar que vengan el email y password
      const validatedData = LoginUserSchema.parse(req.body);

      // 2. Mandar a hacer login al servicio
      const authData = await this.userService.loginUser(validatedData);

      // 3. Si todo sale bien, respondemos con el token (200 OK)
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: authData,
      });

    } catch (error: any) {
      // Error de validación Zod (ej. no mandaron el email)
      if (error.name === 'ZodError') {
         res.status(400).json({ success: false, errors: error.errors });
         return;
      }

      // Error de credenciales incorrectas (401 Unauthorized)
      if (error.message === 'INVALID_CREDENTIALS') {
         res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
         return;
      }

      // Error interno
      console.error(error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await this.userService.getAllUsers();

        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: users
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            sucess: false,
            message: 'Error interno del servidor al obtener los datos'
        });
    }
  };
}