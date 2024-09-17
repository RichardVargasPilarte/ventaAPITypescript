import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const usuarioClient = new PrismaClient().usuario;

interface CustomRequest extends Request {
    uid?: string;
}

// Middleware para validar JWT
export const validarJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No hay token en la petición'
            }
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET as string) as { uid: string };
        req.uid = uid;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
};
