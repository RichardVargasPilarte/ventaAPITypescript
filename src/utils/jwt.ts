import jwt from 'jsonwebtoken';

export const generarJWT = (uid: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

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
