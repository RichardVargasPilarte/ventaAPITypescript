import { Router } from 'express';
import * as articuloController from '../controllers/articuloController';
import { body } from 'express-validator';

import { validarJWT } from '../middlewares/validarJWT';
import { validarCampos } from '../middlewares/validarCampos';
import * as verificarRol from '../middlewares/verificarRoles';

const router = Router();

router.get('/', validarJWT, verificarRol.verificarBodeguero, articuloController.obtenerArticulos);
router.get('/:id', validarJWT, verificarRol.verificarBodeguero, articuloController.obtenerArticuloId);
router.get('/:codigo', validarJWT, verificarRol.verificarUsuario, articuloController.obtenerArticuloPorCodigo);

router.post('/', [
    validarJWT,
    verificarRol.verificarBodeguero,
    body('categoria_id').notEmpty().withMessage('El campo categoria_id es obligatorio'),
    body('nombre').notEmpty().withMessage('El campo nombre es obligatorio').isLength({ max: 50 }).withMessage('El nombre no puede tener más de 50 caracteres'),
    body('precio_venta').isFloat().withMessage('El campo precio_venta es obligatorio y debe ser un número'),
    body('stock').isInt().withMessage('El campo stock es obligatorio y debe ser un número entero'),
    body('estado').optional().isInt().withMessage('El campo estado debe ser un número entero'),
    body('codigo').optional().isLength({ max: 64 }).withMessage('El campo codigo, si se proporciona, no puede tener más de 64 caracteres'),
    body('descripcion').optional().isLength({ max: 255 }).withMessage('El campo descripcion, si se proporciona, no puede tener más de 255 caracteres'),
], validarCampos, articuloController.crearArticulo);

router.put('/:id', [
    validarJWT,
    verificarRol.verificarBodeguero,
    body('categoria_id').optional().notEmpty().withMessage('El campo categoria_id no puede estar vacío'),
    body('nombre').optional().isLength({ max: 50 }).withMessage('El nombre no puede tener más de 50 caracteres'),
    body('precio_venta').optional().isFloat().withMessage('El campo precio_venta debe ser un número'),
    body('stock').optional().isInt().withMessage('El campo stock debe ser un número entero'),
    body('estado').optional().isInt().withMessage('El campo estado debe ser un número entero'),
    body('codigo').optional().isLength({ max: 64 }).withMessage('El campo codigo, si se proporciona, no puede tener más de 64 caracteres'),
    body('descripcion').optional().isLength({ max: 255 }).withMessage('El campo descripcion, si se proporciona, no puede tener más de 255 caracteres'),
], validarCampos, articuloController.actualizarArticulo);

router.delete('/:id', validarJWT, verificarRol.verificarBodeguero, articuloController.eliminarArticulo);
router.put('/:id/activar', validarJWT, verificarRol.verificarBodeguero, articuloController.activarArticulo);
router.put('/:id/desactivar', validarJWT, verificarRol.verificarBodeguero, articuloController.desactivarArticulo);

export default router;