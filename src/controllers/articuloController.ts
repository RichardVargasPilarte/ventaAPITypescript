import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate as isUUID } from 'uuid';

const articuloClient = new PrismaClient().articulo;

export const obtenerArticulos = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Obtener los parámetros de búsqueda y paginación de la consulta
        const { nombre, categoria, descripcion, page = 1, limit = 10 } = req.query;

        // Convertir `page` y `limit` a números
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Calcular el desplazamiento (skip) para la paginación
        const skip = (pageNumber - 1) * limitNumber;

        // Asegurarse de que las consultas sean cadenas de texto
        const nombreQuery = nombre ? String(nombre) : undefined;
        const categoriaQuery = categoria ? String(categoria) : undefined;
        const descripcionQuery = descripcion ? String(descripcion) : undefined;

        const articulos = await articuloClient.findMany({
            where: {
                eliminado: 'NO',
                ...(nombreQuery && { nombre: { contains: nombreQuery, mode: 'insensitive' } }), // Búsqueda por nombre
                ...(categoriaQuery && { categoria: { nombre: { contains: categoriaQuery, mode: 'insensitive' } } }), // Búsqueda por categoría
                ...(descripcionQuery && { descripcion: { contains: descripcionQuery, mode: 'insensitive' } }) // Búsqueda por descripción
            },
            include: {
                categoria: { select: { nombre: true } }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skip,
            take: limitNumber
        });

        // Contar el número total de artículos para la paginación
        const totalArticulos = await articuloClient.count({
            where: {
                ...(nombreQuery && { nombre: { contains: nombreQuery, mode: 'insensitive' } }), 
                ...(categoriaQuery && { categoria: { nombre: { contains: categoriaQuery, mode: 'insensitive' } } }), 
                ...(descripcionQuery && { descripcion: { contains: descripcionQuery, mode: 'insensitive' } }) 
            }
        });

        res.status(200).json({ 
            data: articulos,
            total: totalArticulos,
            page: pageNumber,
            totalPages: Math.ceil(totalArticulos / limitNumber)
        });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerArticuloId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articuloId = req.params.id;

        if (!isUUID(articuloId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const articulo = await articuloClient.findUnique({
            where: {
                id: articuloId
            },
            include: {
                categoria: { select: { nombre: true } }
            }
        });

        if (!articulo) {
            res.status(404).send({
                message: 'El articulo no existe'
            });
        } else {
            res.status(200).json({ data: articulo })
        }
        
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerArticuloPorCodigo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articuloCodigo = req.params.codigo;

        const articulo = await articuloClient.findFirst({
            where: {
                codigo: articuloCodigo,
                eliminado: 'NO'
            },
            include: {
                categoria: { select: { nombre: true } }
            }
        });

        if (!articulo) {
            res.status(404).send({
                message: 'El articulo no existe'
            });
        } else {
            res.status(200).json({ data: articulo })
        }
        
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const crearArticulo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nombre, ...data } = req.body;

        // Verificar si ya existe un registro con el mismo nombre
        const existeArticulo = await articuloClient.findUnique({
            where: { nombre }
        });

        if (existeArticulo) {
            return res.status(400).json({
                message: 'El articulo ya está registrado.'
            });
        }

        const articulo = await articuloClient.create({
            data: {
                nombre,
                ...data
            }
        })
        res.status(201).json({ data: articulo })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const actualizarArticulo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articuloId = req.params.id;
        const articuloData = req.body;

        if (!isUUID(articuloId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const articulo = await articuloClient.update({
            where: {
                id: articuloId
            },
            data: articuloData
        });

        res.status(200).json({ data: articulo })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const eliminarArticulo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articuloId = req.params.id;

        if (!isUUID(articuloId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const articulo = await articuloClient.findUnique({
            where: { id: articuloId }
        });

        if (!articulo) {
            return res.status(404).send({ message: 'Articulo no encontrado' });
        }

        const articuloActualizado = await articuloClient.update({
            where: { id: articuloId },
            data: { eliminado: 'SI' }
        });
        res.status(200).json({ data: articuloActualizado })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const activarArticulo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articuloId = req.params.id;

        const articulo = await articuloClient.update({
            where: {
                id: articuloId
            },
            data: {
                estado: 1
            }
        });

        res.status(200).json({ data: articulo })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const desactivarArticulo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articuloId = req.params.id;

        const articulo = await articuloClient.update({
            where: {
                id: articuloId
            },
            data: {
                estado: 0
            }
        });

        res.status(200).json({ data: articulo })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}