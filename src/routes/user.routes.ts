import { Router } from 'express';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.services.js';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/register', userController.register);
router.post('/login', userController.login); 
router.get('/', userController.getAll);
router.patch('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;