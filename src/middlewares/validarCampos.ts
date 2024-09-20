import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Define el middleware para validar los campos
export const validarCampos = (req: Request, res: Response, next: NextFunction): void => {
    // Obtén los errores de la validación
    const errores = validationResult(req);

    // Si hay errores, envía una respuesta con el estado 400 y los errores
    if (!errores.isEmpty()) {
        res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
        return; // Termina la ejecución del middleware después de enviar la respuesta
    }

    // Si no hay errores, continúa con la siguiente función de middleware
    next();
};
