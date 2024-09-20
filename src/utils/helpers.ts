// utils/verification.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para transformar el campo id a uid
export const transformToUid = (usuario: any) => {
    const { id, password, ...data } = usuario;
    return { uid: id, ...data };
};

type CampoBusqueda = 'nombre' | 'username' | 'email';

// Función para verificar la existencia de un campo en la base de datos
export const verificarExistencia = async (campo: CampoBusqueda, valor: string, prismaClient: PrismaClient) => {
    // Validar que el valor no esté vacío
    if (!valor || valor.trim() === '') {
        throw new Error('El valor para la búsqueda no puede ser nulo o vacío');
    }

    // Validar que el campo sea uno de los permitidos
    if (!['nombre', 'username', 'email'].includes(campo)) {
        throw new Error('Campo no válido para la búsqueda');
    }

    // Construir el objeto where dinámicamente
    const where = { [campo]: valor } as Record<CampoBusqueda, string>;

    try {
        // Realizar la consulta en Prisma
        const resultado = await prismaClient.usuario.findUnique({
            where,
        });

        return resultado;
    } catch (error: unknown) {
        // Manejar errores de la consulta
        if (error instanceof Error) {
            throw new Error(`Error al verificar existencia: ${error.message}`);
        } else {
            throw new Error('Error desconocido al verificar existencia');
        }
    }
};


// Función para actualizar el estado del usuario
export const actualizarEstadoUsuario = async (usuarioId: string, estado: number, prismaClient: PrismaClient) => {
    try {
        const usuario = await prismaClient.usuario.update({
            where: { id: usuarioId },
            data: { estado }
        });

        if (!usuario) {
            throw new Error('El usuario no existe o no se pudo actualizar');
        }
        
        return transformToUid(usuario); // Se llama a la función transformar `id` a `uid`
    } catch (error) {
        throw new Error('Ocurrió un error al actualizar el estado del usuario');
    }
};
