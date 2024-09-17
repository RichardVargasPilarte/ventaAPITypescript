import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate as isUUID } from 'uuid';
import { aumentarStock, disminuirStock } from '../utils/stockHelpers';

const ventaClient = new PrismaClient().venta;
const prisma = new PrismaClient();

export const obtenerventas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ventas = await ventaClient.findMany({
            include: {
                usuario: { select: { nombre: true } },
                persona: { select: { nombre: true } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({ data: ventas });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const obtenerVentaId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ventaId = req.params.id;

        if (!isUUID(ventaId)) {
            return res.status(400).send({ message: 'ID inválido' });
        }

        const venta = await ventaClient.findUnique({
            where: { id: ventaId },
            include: {
                usuario: { select: { nombre: true } },
                persona: { select: { nombre: true } }
            }
        });

        if (!venta) {
            res.status(404).send({ message: 'El registro no existe' });
        } else {
            res.status(200).json({ data: venta });
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
        const { detalles, ...ventaData } = req.body;

        const venta = await ventaClient.create({
            data: {
                ...ventaData,
                detalles: {
                    create: detalles,
                },
            },
        });

        // Actualizar stock
        for (const detalle of detalles) {
            await disminuirStock(detalle.articuloId, detalle.cantidad);
        }

        res.status(201).json({ data: venta });
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const activarVenta = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ventaId = req.params.id;

        const venta = await ventaClient.update({
            where: {
                id: ventaId
            },
            data: {
                estado: 1
            },
            include: {
                detalles: true
            }
        });

        // Actualizar stock
        for (const detalle of venta.detalles) {
            await disminuirStock(detalle.articulo, detalle.cantidad);
        }

        res.status(200).json({ data: venta })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}

export const desactivarVenta = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ventaId = req.params.id;

        const venta = await ventaClient.update({
            where: {
                id: ventaId
            },
            data: {
                estado: 0
            },
            include: {
                detalles: true
            }
        });

        const detalles = venta.detalles;
        for (const detalle of detalles) {
            await disminuirStock(detalle.articulo, detalle.cantidad);
        }

        res.status(200).json({ data: venta })
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

        const ventas = await prisma.$queryRaw`
            SELECT
                EXTRACT(YEAR FROM "createdAt") AS year,
                EXTRACT(MONTH FROM "createdAt") AS month,
                SUM(total) AS total,
                COUNT(id) AS numero
            FROM venta
            WHERE "createdAt" BETWEEN ${start.toISOString()} AND ${end.toISOString()}
            GROUP BY year, month
            ORDER BY year DESC, month DESC
        `;
        res.status(200).json({ data: ventas })

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

        const ventas = await ventaClient.findMany({
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

        res.status(200).json({ data: ventas })
    } catch (error) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(error);
    }
}
