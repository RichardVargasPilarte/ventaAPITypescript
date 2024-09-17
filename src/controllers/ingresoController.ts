import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate as isUUID } from 'uuid';
import { aumentarStock, disminuirStock } from '../utils/stockHelpers';

const ingresoClient = new PrismaClient().ingreso;
const prisma = new PrismaClient();

export const obtenerIngresos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingresos = await ingresoClient.findMany({
            include: {
                usuario: { select: { nombre: true } },
                persona: { select: { nombre: true } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({ data: ingresos });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerIngresoId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingresoId = req.params.id;

        if (!isUUID(ingresoId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const ingreso = await ingresoClient.findUnique({
            where: { id: ingresoId },
            include: {
                usuario: { select: { nombre: true } },
                persona: { select: { nombre: true } }
            }
        });

        if (!ingreso) {
            res.status(404).send({ message: 'El registro no existe' });
        } else {
            res.status(200).json({ data: ingreso });
        }

    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const crearIngreso = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingreso = await ingresoClient.create({
            data: {
                ...req.body,
                detalles: {
                    create: req.body.detalles,
                },
            },
        });

        // Actualizar stock de cada artículo en los detalles
        const detalles = req.body.detalles;
        for (const detalle of detalles) {
            await aumentarStock(detalle.articulo_id, detalle.cantidad);
        }

        res.status(201).json({ data: ingreso });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const activarIngreso = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingresoId = req.params.id;

        const ingreso = await ingresoClient.update({
            where: {
                id: ingresoId
            },
            data: {
                estado: 1
            },
            include: {
                detalles: true
            }
        });

        // Actualizar stock de cada artículo en los detalles del ingreso
        const detalles = ingreso.detalles;
        for (const detalle of detalles) {
            await aumentarStock(detalle.articulo, detalle.cantidad);
        }

        res.status(200).json({ data: ingreso })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const desactivarIngreso = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingresoId = req.params.id;
        const ingreso = await ingresoClient.update({
            where: {
                id: ingresoId
            },
            data: {
                estado: 0
            },
            include: {
                detalles: true
            }
        });

        // Disminuir stock de cada artículo en los detalles del ingreso
        const detalles = ingreso.detalles;
        for (const detalle of detalles) {
            await disminuirStock(detalle.articulo, detalle.cantidad);
        }

        res.status(200).json({ data: ingreso })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const grafico12Meses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtén la fecha actual y calcula la fecha de hace 12 meses
        const end = new Date(); // Fecha actual
        const start = new Date(); // Fecha actual menos 12 meses
        start.setMonth(start.getMonth() - 12);

        const ingresos = await prisma.$queryRaw`
            SELECT
                EXTRACT(YEAR FROM "createdAt") AS year,
                EXTRACT(MONTH FROM "createdAt") AS month,
                SUM(total) AS total,
                COUNT(id) AS numero
            FROM ingreso
            WHERE "createdAt" BETWEEN ${start.toISOString()} AND ${end.toISOString()}
            GROUP BY year, month
            ORDER BY year DESC, month DESC
        `;
        res.status(200).json({ data: ingresos })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const consultaFechas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const start = new Date(req.query.start as string);
        const end = new Date(req.query.end as string);

        // Validar que las fechas sean válidas
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).send({ message: 'Fechas inválidas' });
        }

        const ingresos = await ingresoClient.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                usuario: { select: { nombre: true } },
                persona: { select: { nombre: true } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({ data: ingresos })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}
