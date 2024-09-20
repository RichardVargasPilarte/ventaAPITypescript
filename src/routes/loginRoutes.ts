import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { validarJWT } from '../middlewares/validarJWT';
import { validarCampos } from '../middlewares/validarCampos';

const router = Router();

// Ruta para iniciar sesión
router.post('/', [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
], validarCampos, authController.login);

// Ruta para renovar el token JWT
// Esta ruta está protegida por el middleware de autenticación `validarJWT`
router.get('/renew-token', validarJWT, validarCampos, authController.renewToken);

export default router;
