import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para aumentar el stock
export async function aumentarStock(articuloId: string, cantidad: number) {
  const articulo = await prisma.articulo.findUnique({
    where: { id: articuloId },
  });

  if (articulo) {
    const nuevoStock = articulo.stock + cantidad;
    await prisma.articulo.update({
      where: { id: articuloId },
      data: { stock: nuevoStock },
    });
  }
}

// Función para disminuir el stock
export async function disminuirStock(articuloId: string, cantidad: number) {
  const articulo = await prisma.articulo.findUnique({
    where: { id: articuloId },
  });

  if (articulo) {
    const nuevoStock = articulo.stock - cantidad;
    await prisma.articulo.update({
      where: { id: articuloId },
      data: { stock: nuevoStock },
    });
  }
}
