import mongoose from "mongoose"

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
        console.error(`Error al conectar la DB: ${error}`);
    }
}