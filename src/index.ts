import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//import userRoutes from './routes/usuarioRoutes';
import articuloRoutes from './routes/articuloRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
//app.use('/api/usuarios', userRoutes);
app.use('/api/articulo', articuloRoutes);
app.use('/api/categoria', categoriaRoutes);

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.APP_PORT || 3000}`);
});