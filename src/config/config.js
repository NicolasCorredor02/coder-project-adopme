import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option("-m, --mode <MODE>", "Ejecution mode (dev / prod)", "dev")

program.parse()
const { mode } = program.opts()

if (mode  != "dev" && mode != "prod") {
    console.log(`Para el argumento -m / --mode solo se aceptan los valores de prod o dev`);
    process.exit()
}

dotenv.config({
    path: mode == "dev" ? "./.env" : "./.env.prod",
    override: true,
    quiet: true,
})

export const config = {
    GENERAL: {
        PORT: process.env.PORT || 3000,
    },
    DATABASE: {
        MONGO_URL: process.env.MONGO_URL,
        DB_NAME: process.env.DB_NAME,
    },
    AUTH: {
        JWT_KEY: process.env.JWT_SECRET_KEY
    }
}