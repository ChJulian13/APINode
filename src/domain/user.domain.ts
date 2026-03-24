import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 letras"),
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Validación para los datos de inicio de sesión
export const LoginUserSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"), // Aquí no validamos la longitud, solo que la envíen
});

export type LoginUserDTO = z.infer<typeof LoginUserSchema>;

// Tipo de respuesta para cuando el usuario hace login con éxito
export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}