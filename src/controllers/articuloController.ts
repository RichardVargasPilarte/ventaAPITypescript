import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { validate as isUUID } from 'uuid';

const articuloClient = new PrismaClient().articulo;

export const obtenerArticulos = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Condiciones de búsqueda
        const filters: Prisma.ArticuloWhereInput = {
            eliminado: 'NO',
        };

        if (req.query.nombre) {
            filters.nombre = {
                contains: String(req.query.nombre),
                mode: 'insensitive',
            };
        }

        if (req.query.categoria) {
            filters.categoria = {
                nombre: {
                    contains: String(req.query.categoria),
                    mode: 'insensitive',
                },
            };
        }

        if (req.query.descripcion) {
            filters.descripcion = {
                contains: String(req.query.descripcion),
                mode: 'insensitive',
            };
        }

        // Paginación
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Contar el total de artículos con los filtros aplicados
        const totalArticulos = await articuloClient.count({
            where: filters,
        });

        // Calcular el número total de páginas
        const totalPages = Math.ceil(totalArticulos / limit);

        // Verificar si la página solicitada existe
        if (page > totalPages && totalPages > 0) {
            return res.status(404).json({
                ok: false,
                message: `La página solicitada (${page}) no existe. Total de páginas: ${totalPages}.`
            });
        }

        // Obtener los artículos con paginación y filtros
        const articulos = await articuloClient.findMany({
            where: filters,
            include: {
                categoria: { select: { nombre: true } }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skip,
            take: limit,
        });

        res.status(200).json({
            data: articulos,
            total: totalArticulos,
            page: page,
            totalPages: totalPages
        });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
};


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