import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController';
import { body, param } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos ';

const router = Router();

router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioId);

router.post('/', [
    body('rol').notEmpty().withMessage('El campo rol es obligatorio')
        .isLength({ max: 30 }).withMessage('El rol no puede tener más de 30 caracteres'),
    body('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre no puede tener más de 50 caracteres'),
    body('username').notEmpty().withMessage('El campo username es obligatorio')
        .isLength({ max: 30 }).withMessage('El username no puede tener más de 30 caracteres'),
    body('email').isEmail().withMessage('El campo email debe ser un correo válido')
        .isLength({ max: 50 }).withMessage('El email no puede tener más de 50 caracteres'),
    body('password').notEmpty().withMessage('El campo password es obligatorio')
        .isLength({ max: 64 }).withMessage('El password no puede tener más de 64 caracteres'),
    body('tipo_documento').optional().isLength({ max: 20 }).withMessage('El tipo de documento no puede tener más de 20 caracteres'),
    body('num_documento').optional().isLength({ max: 20 }).withMessage('El número de documento no puede tener más de 20 caracteres'),
    body('direccion').optional().isLength({ max: 70 }).withMessage('La dirección no puede tener más de 70 caracteres'),
    body('telefono').optional().isLength({ max: 20 }).withMessage('El teléfono no puede tener más de 20 caracteres'),
    body('estado').optional().isInt().withMessage('El estado debe ser un número entero'),
], validarCampos, usuarioController.crearUsuario);

// Actualizar un usuario por ID
router.put('/:id', [
    body('tipo_documento').optional().isLength({ max: 20 }).withMessage('El tipo de documento no puede tener más de 20 caracteres'),
    body('num_documento').optional().isLength({ max: 20 }).withMessage('El número de documento no puede tener más de 20 caracteres'),
    body('direccion').optional().isLength({ max: 70 }).withMessage('La dirección no puede tener más de 70 caracteres'),
    body('telefono').optional().isLength({ max: 20 }).withMessage('El teléfono no puede tener más de 20 caracteres'),
    body('estado').optional().isInt().withMessage('El estado debe ser un número entero'),

], validarCampos, usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
router.put('/:id', usuarioController.activarUsuario);
router.put('/:id', usuarioController.desactivarUsuario);

export default router;