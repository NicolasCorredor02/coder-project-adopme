import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import { usersService } from "../services/index.js";
import { CustomError } from "../utils/CustomError.js";
import { ERRORS } from "../utils/Errors.js";
import petMock from "../utils/mocks/petMockGenerator.js"
import userMock from "../utils/mocks/userMockGenerator.js"


const createPetsMock = async (req, res, next) => {
    try {
        const petsGeneratedWithMock = await petMock.petMockGenerator(50);
        res.json({
            success: true,
            message: "Se han generado 50 mascotas exitosamente haciendo uso del mock",
            payload: petsGeneratedWithMock
        })
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
}

const createUsersMock = async (req, res, next) => {
    try {
        const usersGeneratedWithMock = await userMock.userMockGenerator(50);
        res.json({
            success: true,
            message: "Se han generado 50 usuarios exitosamente haciendo uso del mock",
            payload: usersGeneratedWithMock
        })
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error)
    }
}

const generateDataWithMock = async (req, res, next) => {
    try {
        // Se recuperan los query params para determinar la cantidad de mascotas y usuarios a crear a traves de los mocks
        const usersQuantity = req.query.users || 20; // valor default 20
        const petsQuantity = req.query.pets || 20; // valor default 20

        if (usersQuantity <= 0 || petsQuantity <= 0) {
            CustomError.throwError(ERRORS.VALIDATION.INVALID_QUERY_PARAMS, "Las cantidades de usuarios y/o mascotas nos pueden menor o igual a 0!")
        }
        
        // Mascotas y usuarios generados (corrigiendo parámetros intercambiados)
        const petsGeneratedWithMock = await petMock.petMockGenerator(parseInt(petsQuantity));
        const usersGeneratedWithMock = await userMock.userMockGenerator(parseInt(usersQuantity));


        // Creacion de usuarios en la base de datos usando Promise.all para esperar todas las operaciones
        const createdUsers = await Promise.all(usersGeneratedWithMock.map(async (user) => {
            try {
                // Verificar si el usuario ya existe
                const exists = await usersService.getUserByEmail(user.email);
                if (exists) {
                    CustomError.userError('ALREADY_EXISTS');
                }
    
                const newUser = await usersService.create(user);
                return newUser;
            } catch (error) {
                req.logger.error(`Error: ${error.message}`);
                throw error;
            }
        }));
        
        // Creacion de las mascotas en la base de datos usando Promise.all para esperar todas las operaciones
        const createdPets = await Promise.all(petsGeneratedWithMock.map(async (pet) => {
            try {
                const newPet = await petsService.create(pet);
                console.log("new pet:", newPet);
                return newPet;
            } catch (error) {
                throw error;
            }
        }));

        res.json({
            success: true,
            message: `Se han generado ${usersQuantity} usuarios y ${petsQuantity} mascotas exitosamente`,
            payload: {
                users: createdUsers,
                pets: createdPets
            }
        })
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error)
    }
}

export default {
    createPetsMock,
    createUsersMock,
    generateDataWithMock
}


