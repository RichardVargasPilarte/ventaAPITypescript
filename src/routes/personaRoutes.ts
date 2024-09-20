import { Router } from 'express';
import * as personaController from '../controllers/personaController';
import { body } from 'express-validator';

import { validarCampos } from '../middlewares/validarCampos';

const router = Router();

// Obtener todas las personas
router.get('/', personaController.obtenerPersonas);

// Obtener una persona por ID
router.get('/:id', personaController.obtenerPersonaId);

// Crear una nueva persona
router.post('/', [
    body('tipo_persona')
        .notEmpty().withMessage('El campo tipo_persona es obligatorio')
        .isLength({ max: 20 }).withMessage('El tipo_persona no puede tener más de 20 caracteres'),
    body('nombre')
        .notEmpty().withMessage('El campo nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre no puede tener más de 50 caracteres'),
    body('tipo_documento')
        .optional().isLength({ max: 20 }).withMessage('El tipo_documento no puede tener más de 20 caracteres'),
    body('num_documento')
        .optional().isLength({ max: 20 }).withMessage('El num_documento no puede tener más de 20 caracteres'),
    body('direccion')
        .optional().isLength({ max: 70 }).withMessage('El campo direccion no puede tener más de 70 caracteres'),
    body('telefono')
        .optional().isLength({ max: 20 }).withMessage('El campo telefono no puede tener más de 20 caracteres'),
    body('email')
        .optional().isEmail().withMessage('Debe proporcionar un correo electrónico válido')
        .isLength({ max: 50 }).withMessage('El email no puede tener más de 50 caracteres'),
    body('estado')
        .optional().isInt().withMessage('El campo estado debe ser un número entero'),
], validarCampos, personaController.crearPersona);

// Actualizar una persona por ID
router.put('/:id', [
    body('tipo_persona')
        .optional().notEmpty().withMessage('El campo tipo_persona no puede estar vacío')
        .isLength({ max: 20 }).withMessage('El tipo_persona no puede tener más de 20 caracteres'),
    body('nombre')
        .optional().isLength({ max: 50 }).withMessage('El nombre no puede tener más de 50 caracteres'),
    body('tipo_documento')
        .optional().isLength({ max: 20 }).withMessage('El tipo_documento no puede tener más de 20 caracteres'),
    body('num_documento')
        .optional().isLength({ max: 20 }).withMessage('El num_documento no puede tener más de 20 caracteres'),
    body('direccion')
        .optional().isLength({ max: 70 }).withMessage('El campo direccion no puede tener más de 70 caracteres'),
    body('telefono')
        .optional().isLength({ max: 20 }).withMessage('El campo telefono no puede tener más de 20 caracteres'),
    body('email')
        .optional().isEmail().withMessage('Debe proporcionar un correo electrónico válido')
        .isLength({ max: 50 }).withMessage('El email no puede tener más de 50 caracteres'),
    body('estado')
        .optional().isInt().withMessage('El campo estado debe ser un número entero'),
], validarCampos, personaController.actualizarPersona);

// Eliminar una persona por ID
router.delete('/:id', personaController.eliminarPersona);

// Activar una persona
router.put('/:id/activar', personaController.activarPersona);

// Desactivar una persona
router.put('/:id/desactivar', personaController.desactivarPersona);

export default router;
