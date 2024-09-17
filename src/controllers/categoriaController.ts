import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate as isUUID } from 'uuid';

const categoriaClient = new PrismaClient().categoria;

export const obtenerCategorias = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const categorias = await categoriaClient.findMany({
            where: {
                eliminado: 'NO'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.status(200).json({ data: categorias });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerCategoriaPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoriaId = req.params.id;

        if (!isUUID(categoriaId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const categoria = await categoriaClient.findUnique({
            where: {
                id: categoriaId
            }
        });

        if (!categoria) {
            res.status(404).send({
                message: 'El registro no existe'
            });
        } else {
            res.status(200).json({ data: categoria });
        }
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const crearCategoria = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nombre, descripcion } = req.body;

        // Verificar si ya existe una categoría con el mismo nombre
        const categoriaExistente = await categoriaClient.findUnique({
            where: {
                nombre: nombre
            }
        });

        // Si la categoría ya existe, retornar un error
        if (categoriaExistente) {
            return res.status(400).json({
                message: 'La categoría ya existe'
            });
        }

        const categoria = await categoriaClient.create({
            data: {
                nombre,
                descripcion
            }
        });

        res.status(201).json({ data: categoria })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const actualizarCategoria = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoriaId = req.params.id;
        const categoriaData = req.body;

        if (!isUUID(categoriaId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const categoria = await categoriaClient.update({
            where: {
                id: categoriaId
            },
            data: categoriaData
        })

        res.status(200).json({ data: categoria })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const eliminarCategoria = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoriaId = req.params.id;

        if (!isUUID(categoriaId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const categoria = await categoriaClient.findUnique({
            where: { id: categoriaId }
        });

        if (!categoria) {
            return res.status(404).send({ message: 'Categoría no encontrada' });
        }

        const categoriaActualizada = await categoriaClient.update({
            where: { id: categoriaId },
            data: { eliminado: 'SI' }
        });
        res.status(200).json({ data: categoriaActualizada })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const activarCategoria = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoriaId = req.params.id;

        const categoria = await categoriaClient.update({
            where: {
                id: categoriaId
            },
            data: {
                estado: 1
            }
        });

        res.status(200).json({ data: categoria })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const desactivarCategoria = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoriaId = req.params.id;

        const categoria = await categoriaClient.update({
            where: {
                id: categoriaId
            },
            data: {
                estado: 0
            }
        });

        res.status(200).json({ data: categoria })
    } catch (error) {
       res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error); 
    }
}