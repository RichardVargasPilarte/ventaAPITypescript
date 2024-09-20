import { Router } from 'express';
import * as categoriaController from '../controllers/categoriaController';
import { body } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos';

const router = Router();

router.get('/', categoriaController.obtenerCategorias);
router.get('/:id', categoriaController.obtenerCategoriaPorId);

router.post('/', [
    body('nombre').notEmpty().withMessage('El campo nombre es obligatorio').isLength({ max: 50 }).withMessage('El nombre no puede tener más de 50 caracteres'),
    body('descripcion').optional().isLength({ max: 255 }).withMessage('La descripción, si se proporciona, no puede tener más de 255 caracteres'),
    body('estado').optional().isInt().withMessage('El campo estado debe ser un número entero')
], validarCampos, categoriaController.crearCategoria);

router.put('/:id', [
    body('nombre').optional().isLength({ max: 50 }).withMessage('El nombre no puede tener más de 50 caracteres'),
    body('descripcion').optional().isLength({ max: 255 }).withMessage('La descripción, si se proporciona, no puede tener más de 255 caracteres'),
    body('estado').optional().isInt().withMessage('El campo estado debe ser un número entero')
], validarCampos, categoriaController.actualizarCategoria);

router.delete('/:id', categoriaController.eliminarCategoria);
router.put('/:id/activar', categoriaController.activarCategoria);
router.put('/:id/desactivar', categoriaController.desactivarCategoria);

export default router;