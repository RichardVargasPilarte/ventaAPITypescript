import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate as isUUID } from 'uuid';
import bcrypt from 'bcryptjs';

import { verificarExistencia, transformToUid, actualizarEstadoUsuario } from '../utils/helpers';
import { generarJWT } from '../utils/jwt';

const prisma = new PrismaClient();
const usuarioClient = new PrismaClient().usuario;

export const obtenerUsuarios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarios = await usuarioClient.findMany({
            where: {
                eliminado: 'NO'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({ data: usuarios.map(transformToUid) });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerUsuarioId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarioId = req.params.id;

        if (!isUUID(usuarioId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const usuario = await usuarioClient.findUnique({
            where: {
                id: usuarioId
            },
        });

        if (!usuario) {
            res.status(404).send({ message: 'El usuario no existe' });
        } else {
            res.status(200).json({ data: transformToUid(usuario) });
        }

    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const crearUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nombre, username, email, password, ...data } = req.body;

        if (await verificarExistencia('nombre', nombre, prisma)) {
            return res.status(400).json({ message: 'El nombre ya está registrado.' });
        }

        if (await verificarExistencia('username', username, prisma)) {
            return res.status(400).json({ message: 'El nombre de usuario ya está registrado.' });
        }

        if (await verificarExistencia('email', email, prisma)) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar la contraseña antes de crear el usuario
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

        const usuario = await usuarioClient.create({
            data: {
                nombre,
                username,
                email,
                password: hashedPassword,
                ...data
            }
        })

        const token = await generarJWT(usuario.id);

        res.status(201).json({
            data: transformToUid(usuario), // Cambiar id a uid
            token
        });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const actualizarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarioId = req.params.id;
        const { nombre, username, email, password, ...datos } = req.body;

        if (!isUUID(usuarioId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        // Verificar existencia solo si el campo está presente
        if (nombre && await verificarExistencia('nombre', nombre, prisma)) {
            return res.status(400).json({ message: 'El nombre ya está registrado.' });
        }

        if (username && await verificarExistencia('username', username, prisma)) {
            return res.status(400).json({ message: 'El nombre de usuario ya está registrado.' });
        }

        if (email && await verificarExistencia('email', email, prisma)) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const usuarioActualizado = await usuarioClient.update({
            where: {
                id: usuarioId
            },
            data: {
                ...datos
            }
        });

        res.status(200).json({
            data: transformToUid(usuarioActualizado) // Cambiar id a uid
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const eliminarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarioId = req.params.id;

        if (!isUUID(usuarioId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const usuario = await usuarioClient.findUnique({
            where: { id: usuarioId }
        });

        if (!usuario) {
            return res.status(404).send({ message: 'usuario no encontrado' });
        }

        const usuarioActualizado = await usuarioClient.update({
            where: { id: usuarioId },
            data: { eliminado: 'SI' }
        });
        res.status(200).json({ data: usuarioActualizado })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const activarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarioId = req.params.id;

        const usuario = await actualizarEstadoUsuario(usuarioId, 1, prisma);

        res.status(200).json({ data: usuario });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const desactivarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarioId = req.params.id;

        if (!isUUID(usuarioId)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }

        const usuario = await actualizarEstadoUsuario(usuarioId, 0, prisma);

        res.status(200).json({ data: usuario });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}