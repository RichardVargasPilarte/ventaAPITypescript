import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate as isUUID } from 'uuid';
import bcrypt from 'bcryptjs';

import { generarJWT } from '../utils/jwt';
import { validarJWT } from '../middlewares/validarJWT';

const prisma = new PrismaClient();
const usuarioClient = new PrismaClient().usuario;

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const usuarioDB = await usuarioClient.findUnique({
            where: { username }
        });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Nombre de usuario incorrecto'
            });
        }

        // Verificar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar token de jwt
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error inesperado'
        });
        next(error);
    }
}

export const renewToken = async (req: Request, res: Response, next: NextFunction) => {
    const uid = (req as any).uid as string;

    if (!uid) {
        return res.status(400).json({
            ok: false,
            msg: 'No se encontró el ID en la petición'
        });
    }

    try {
        // Generar un nuevo token de JWT
        const token = await generarJWT(uid);

        // Obtener el usuario por UID
        const usuario = await usuarioClient.findUnique({
            where: { id: uid }
        });

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            token,
            usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
        next(error);
    }
};