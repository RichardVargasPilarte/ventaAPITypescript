import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Definimos una interfaz que extiende Request para incluir campos personalizados
interface CustomRequest extends Request {
    uid?: string;
    rol?: string;
    userInfo?: any;
}

// Middleware para validar JWT
export const validarJWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('x-token'); // Obtenemos el token del encabezado

    // Verificamos si el token existe
    if (!token) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No hay token en la petición'
            }
        });
    }

    try {
        // Verificar y extraer la información del token
        const userInfo = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        // Almacenamos la información del usuario en el objeto `req`
        req.uid = userInfo.uid;
        req.rol = userInfo.rol;
        req.userInfo = userInfo;

        // Verificamos si el usuario existe en la base de datos
        const user = await prisma.usuario.findUnique({
            where: {
                id: userInfo.uid
            }
        });

        // Verificamos si el usuario existe, está activo y no ha sido eliminado
        if (!user || user.estado !== 1 || user.eliminado !== "NO") {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no autorizado o inactivo'
            });
        }

        // Si todo está bien, llamamos a `next()` para continuar con la siguiente función middleware
        next();
    } catch (error) {
        // Si el token no es válido, devolvemos una respuesta de error
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
};
