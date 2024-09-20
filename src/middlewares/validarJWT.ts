import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const usuarioClient = new PrismaClient().usuario;

interface CustomRequest extends Request {
    uid: string;
    rol: string;
    userInfo?: any;
}

// Middleware para validar JWT
export const validarJWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
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
        // Verifica el token y extrae la información del usuario (incluyendo uid y rol)
        const userInfo = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        // Almacena la información extraída en el objeto de la request
        req.uid = userInfo.uid;
        req.rol = userInfo.rol;
        req.userInfo = userInfo;  // Almacena toda la información del usuario excepto datos sensibles

        const user = await usuarioClient.findUnique({
            where: {
                id: userInfo.uid
            }
        });

        // Verificar si el usuario existe y si está activo (estado = 1)
        if (!user || user.estado !== 1) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no autorizado o inactivo'
            });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
};
