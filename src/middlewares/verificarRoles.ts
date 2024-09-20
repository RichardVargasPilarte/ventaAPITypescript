import { Request, Response, NextFunction } from 'express';
import { validarJWT } from './validarJWT';

interface CustomRequest extends Request {
    uid: string;
    rol: string;
}

export const verificarUsuario = async (req: CustomRequest, res: Response, next: NextFunction) => {
    await validarJWT(req, res, async () => {
        const { rol } = req; // Supongamos que el rol viene con la información del usuario

        if (rol === 'Administrador' || rol === 'Vendedor' || rol === 'Bodeguero') {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No autorizado'
            });
        }
    });
};

export const verificarAdministrador = async (req: CustomRequest, res: Response, next: NextFunction) => {
    await validarJWT(req, res, async () => {
        const { rol } = req;

        if (rol === 'Administrador') {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No autorizado'
            });
        }
    });
};

export const verificarBodeguero = async (req: CustomRequest, res: Response, next: NextFunction) => {
    await validarJWT(req, res, async () => {
        const { rol } = req;

        if (rol === 'Administrador' || rol === 'Almacenero') {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No autorizado'
            });
        }
    });
};

export const verificarVendedor = async (req: CustomRequest, res: Response, next: NextFunction) => {
    await validarJWT(req, res, async () => {
        const { rol } = req;

        if (rol === 'Administrador' || rol === 'Vendedor') {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No autorizado'
            });
        }
    });
};