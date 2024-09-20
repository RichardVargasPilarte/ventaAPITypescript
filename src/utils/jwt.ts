import jwt from 'jsonwebtoken';

export const generarJWT = (usuario: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        const { password, ...payload } = usuario;

        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('Error al generar token');
                } else {
                    resolve(token as string);
                }
            }
        );
    });
};
