import mongoose from "mongoose"
import { logger } from "../utils/logger.js";

export const connDB = async(urlMongo, dbName) => {
    try {
        await mongoose.connect(
            urlMongo,
            {
                dbName: dbName
            }
        )
        console.log(`DB ${dbName} conectada!`);
    } catch (error) {
        logger.error(`Error al conectar la DB: ${error}`);
    }
}