import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import usuarioRoutes from './routes/usuarioRoutes';
import articuloRoutes from './routes/articuloRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import personaRoutes from './routes/personaRoutes';
import ingresoRoutes from './routes/ingresoRoutes';
import loginRoutes from './routes/loginRoutes'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuario', usuarioRoutes);
app.use('/api/articulo', articuloRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/persona', personaRoutes);
app.use('/api/ingreso', ingresoRoutes);
app.use('/api/login', loginRoutes);

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.APP_PORT || 3000}`);
});