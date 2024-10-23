import { Router } from 'express';
import { param, body, query } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos';
import * as ventaController from '../controllers/ventaController';

const router = Router();

router.post('/', [
    body('usuarioId').isUUID().withMessage('usuarioId debe ser un UUID válido'),
    body('personaId').isUUID().withMessage('personaId debe ser un UUID válido'),
    body('tipo_comprobante').isLength({ max: 20 }).withMessage('tipo_comprobante no puede tener más de 20 caracteres'),
    body('serie_comprobante').optional().isLength({ max: 7 }).withMessage('serie_comprobante no puede tener más de 7 caracteres'),
    body('num_comprobante').isLength({ max: 10 }).withMessage('num_comprobante no puede tener más de 10 caracteres'),
    body('impuesto').isFloat().withMessage('impuesto debe ser un número decimal'),
    body('total').isFloat().withMessage('total debe ser un número decimal'),
    body('detalles').isArray().withMessage('detalles debe ser un array de objetos'),
    body('detalles.*.articuloId')
        .isString().withMessage('articuloId en detalles debe ser una cadena de texto'),
    body('detalles.*.cantidad').isInt().withMessage('cantidad en detalles debe ser un número entero'),
    body('detalles.*.precio').isFloat().withMessage('precio en detalles debe ser un número decimal'),
], validarCampos, ventaController.crearVenta);

// Obtener todos los ingresos
router.get('/', ventaController.obtenerventas);

// Obtener un ingreso por ID
router.get('/:id', [
    param('id').isUUID().withMessage('El id debe ser un UUID válido')
], validarCampos, ventaController.obtenerVentaId);

router.put('/activar/:id', [
    param('id').isUUID().withMessage('El id debe ser un UUID válido')
], validarCampos, ventaController.activarVenta);

// Desactivar un ingreso
router.put('/desactivar/:id', [
    param('id').isUUID().withMessage('El id debe ser un UUID válido')
], validarCampos, ventaController.desactivarVenta);

router.get('/grafico12Meses', ventaController.grafico12Meses);

router.get('/consultaFechas', [
    query('start').isISO8601().withMessage('Fecha de inicio inválida'),
    query('end').isISO8601().withMessage('Fecha de fin inválida')
], validarCampos, ventaController.consultaFechas);

export default router;