import 'dotenv/config'; // <-- ¡ESTO ES LA MAGIA! Debe ir hasta arriba.
import express, { type Application } from 'express';
import userRoutes from './routes/user.routes.js';

const app: Application = express();

app.use(express.json());

app.use('/api/users', userRoutes); 

// Ahora process.env.PORT tomará el valor 3000 de tu archivo .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});