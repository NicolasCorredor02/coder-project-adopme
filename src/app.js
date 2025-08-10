import express from 'express';
import cookieParser from 'cookie-parser';
import { connDB } from './config/db.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();
const PORT = config.GENERAL.PORT;

// Conectar a MongoDB con el nombre de la base de datos
await connDB(config.DATABASE.MONGO_URL, config.DATABASE.DB_NAME);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
