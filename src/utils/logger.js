import { fileURLToPath } from 'url';
import {  dirname } from 'path';
import winston from "winston";
import { mode } from '../config/config.js';

/**
 * Creacion de las rutas para crear almacenar el logger
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const logger = winston.createLogger(
    {
        /**
         * El transporte se configuira en File o Console para poder guardar los logs en un archivo o que solo se muestren por consola
         * 1. filename => ruta y nombre del archivo resultante
         * 2. leve => para indicar el nivel de las alertar que se almacenaran en el log en este caso se esta evaluando el modo de ejecucion 
         * para poder decidir que nivel de filtrado tendran los logs, en el caso de que el mode sea dev, se almacenaran logs hasta el nivel http
         * y en el caso de que el mode sea prod se guardaran los logs hasta el nivel de warning
         * 3. format => formato que tendran las alertar en el log
         */
        transports: [
            new winston.transports.Console(
                {
                    level: mode === "dev" ? "http" : "warn",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }
            ),
            new winston.transports.File(
                { 
                    filename: './src/logs/errorLogs.log', 
                    level: mode === "dev" ? "http" : "warn",
                    format: winston.format.combine(
                        winston.format.timestamp(), 
                        winston.format.json()
                    )
                }
            )
        ]
    }
)

// * Middleware para exportar el logger a todas las rutas
export const middLog = (req, res, next) => {
    try {
        req.logger = logger;
        next();
    } catch (error) {
        console.error(`Error in middLog: ${error.message}`);
        next(error);
    }
};
