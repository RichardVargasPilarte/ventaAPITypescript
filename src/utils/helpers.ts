// utils/verification.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para transformar el campo id a uid
export const transformToUid = (usuario: any) => {
    const { id, ...data } = usuario;
    return { uid: id, ...data };
};

// Función para verificar la existencia de un campo en la base de datos
export const verificarExistencia = async (campo: 'nombre' | 'username' | 'email', valor: string, prismaClient: PrismaClient) => {
    const where = { [campo]: valor };
    return await prismaClient.usuario.findUnique({
        where: where as any
    });
};

// Función para actualizar el estado del usuario
export const actualizarEstadoUsuario = async (usuarioId: string, estado: number, prismaClient: PrismaClient) => {
    try {
        const usuario = await prismaClient.usuario.update({
            where: { id: usuarioId },
            data: { estado }
        });
        return transformToUid(usuario); // Se llama a la función transformar `id` a `uid`
    } catch (error) {
        throw new Error('Ocurrió un error al actualizar el estado del usuario');
    }
};
