import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate as isUUID } from 'uuid';

const personaClient = new PrismaClient().persona;

export const obtenerPersonas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personas = await personaClient.findMany({
            where: {
                eliminado: 'NO'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({ data: personas });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerClientes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientes = await personaClient.findMany({
            where: {
                tipo_persona: 'Cliente',
                eliminado: 'NO'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({ data: clientes });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerProveedores = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const proveedores = await personaClient.findMany({
            where: {
                tipo_persona: 'Proveedor',
                eliminado: 'NO'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({ data: proveedores });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerPersonaId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personaId = req.params.id;

        if (!isUUID(personaId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const persona = await personaClient.findUnique({
            where: {
                id: personaId
            }
        });

        if (!persona) {
            res.status(404).send({
                message: 'El registro no existe'
            });
        } else {
            res.status(200).json({ data: persona })
        }
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const crearPersona = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            nombre,
            email,
            ...data
        } = req.body;

        // Verificar si ya existe un registro con el mismo nombre
        const existePersona = await personaClient.findUnique({
            where: { nombre }
        });

        if (existePersona) {
            return res.status(400).json({
                message: 'La persona ya está registrada.'
            });
        }

        // Verificar si ya existe un registro con el mismo email
        const existeEmail = await personaClient.findUnique({
            where: { email }
        });

        if (existeEmail) {
            return res.status(400).json({
                message: 'El correo electrónico ya está registrado.'
            });
        }

        const persona = await personaClient.create({
            data: {
                nombre,
                email,
                ...data
            }
        });

        res.status(201).json({ data: persona })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const actualizarPersona = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personaId = req.params.id;
        const personaData = req.body;

        if (!isUUID(personaId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const persona = await personaClient.update({
            where: {
                id: personaId
            },
            data: personaData
        });

        res.status(200).json({ data: persona })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const eliminarPersona = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personaId = req.params.id;

        if (!isUUID(personaId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const persona = await personaClient.findUnique({
            where: { id: personaId }
        });

        if (!persona) {
            return res.status(404).send({ message: 'Persona no encontrado' });
        }

        const personaActualizado = await personaClient.update({
            where: { id: personaId },
            data: { eliminado: 'SI' }
        });
        res.status(200).json({ data: personaActualizado })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const activarPersona = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personaId = req.params.id;

        const persona = await personaClient.update({
            where: {
                id: personaId
            },
            data: {
                estado: 1
            }
        });

        res.status(200).json({ data: persona })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const desactivarPersona = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personaId = req.params.id;

        const persona = await personaClient.update({
            where: {
                id: personaId
            },
            data: {
                estado: 0
            }
        });

        res.status(200).json({ data: persona })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}