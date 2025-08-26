import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import { CustomError } from "../utils/CustomError.js";
import { ERRORS } from "../utils/Errors.js";
import mongoose from "mongoose";

// Validar formato de ObjectId de MongoDB
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Validar especies permitidas
const validSpecies = ['perro', 'gato', 'conejo', 'hamster', 'pez', 'ave', 'reptil', 'otro'];

// Validar fecha de nacimiento
const isValidBirthDate = (birthDate) => {
    const date = new Date(birthDate);
    const today = new Date();
    return date instanceof Date && !isNaN(date) && date <= today;
};

const getAllPets = async (req, res, next) => {
    try {
        const pets = await petsService.getAll();
        
        res.json({
            success: true,
            message: "Mascotas obtenidas exitosamente",
            payload: pets
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};

const createPet = async (req, res, next) => {
    try {
        const { name, specie, birthDate } = req.body;
        
        // Validar campos requeridos
        if (!name || !specie || !birthDate) {
            CustomError.petError('MISSING_REQUIRED_FIELDS');
        }
        
        // Validar especie
        if (!validSpecies.includes(specie.toLowerCase())) {
            CustomError.petError('INVALID_SPECIES');
        }
        
        // Validar fecha de nacimiento
        if (!isValidBirthDate(birthDate)) {
            CustomError.petError('INVALID_AGE');
        }
        
        const pet = PetDTO.getPetInputFrom({ name, specie: specie.toLowerCase(), birthDate });
        const result = await petsService.create(pet);
        
        res.status(201).json({
            success: true,
            message: "Mascota creada exitosamente",
            payload: {
                id: result._id,
                name: result.name,
                specie: result.specie,
                birthDate: result.birthDate,
                adopted: result.adopted
            }
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};

const updatePet = async (req, res, next) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        
        // Validar formato de ID
        if (!isValidObjectId(petId)) {
            CustomError.validationError('INVALID_ID_FORMAT');
        }
        
        // Validar que el cuerpo no esté vacío
        if (Object.keys(petUpdateBody).length === 0) {
            CustomError.validationError('INVALID_REQUEST_BODY', 'El cuerpo de la petición no puede estar vacío');
        }
        
        // Verificar que la mascota existe
        const existingPet = await petsService.getBy({ _id: petId });
        if (!existingPet) {
            CustomError.petError('NOT_FOUND');
        }
        
        // Validar especie si se está actualizando
        if (petUpdateBody.specie && !validSpecies.includes(petUpdateBody.specie.toLowerCase())) {
            CustomError.petError('INVALID_SPECIES');
        }
        
        // Validar fecha de nacimiento si se está actualizando
        if (petUpdateBody.birthDate && !isValidBirthDate(petUpdateBody.birthDate)) {
            CustomError.petError('INVALID_AGE');
        }
        
        // Normalizar especie si se proporciona
        if (petUpdateBody.specie) {
            petUpdateBody.specie = petUpdateBody.specie.toLowerCase();
        }
        
        const result = await petsService.update(petId, petUpdateBody);
        if (!result) {
            CustomError.petError('UPDATE_FAILED');
        }
        
        res.json({
            success: true,
            message: "Mascota actualizada exitosamente",
            payload: {
                id: result._id,
                name: result.name,
                specie: result.specie,
                birthDate: result.birthDate,
                adopted: result.adopted
            }
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};

const deletePet = async (req, res, next) => {
    try {
        const petId = req.params.pid;
        
        // Validar formato de ID
        if (!isValidObjectId(petId)) {
            CustomError.validationError('INVALID_ID_FORMAT');
        }
        
        // Verificar que la mascota existe
        const existingPet = await petsService.getBy({ _id: petId });
        if (!existingPet) {
            CustomError.petError('NOT_FOUND');
        }
        
        // Verificar si la mascota está adoptada (opcional - decidir si se permite eliminar)
        if (existingPet.adopted) {
            CustomError.petError('ALREADY_ADOPTED', 'No se puede eliminar una mascota que ya ha sido adoptada');
        }
        
        const result = await petsService.delete(petId);
        if (!result) {
            CustomError.petError('DELETE_FAILED');
        }
        
        res.json({
            success: true,
            message: "Mascota eliminada exitosamente",
            payload: {
                deletedPetId: petId
            }
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};

const createPetWithImage = async (req, res, next) => {
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;
        
        // Validar campos requeridos
        if (!name || !specie || !birthDate) {
            CustomError.petError('MISSING_REQUIRED_FIELDS');
        }
        
        // Validar que se subió un archivo
        if (!file) {
            CustomError.throwError(ERRORS.FILE.UPLOAD_FAILED, 'No se proporcionó ningún archivo de imagen');
        }
        
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            CustomError.throwError(ERRORS.FILE.INVALID_FILE_TYPE, 'Solo se permiten imágenes en formato JPG, PNG o GIF');
        }
        
        // Validar tamaño del archivo (ejemplo: máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            CustomError.throwError(ERRORS.FILE.FILE_TOO_LARGE, 'La imagen no puede superar los 5MB');
        }
        
        // Validar especie
        if (!validSpecies.includes(specie.toLowerCase())) {
            CustomError.petError('INVALID_SPECIES');
        }
        
        // Validar fecha de nacimiento
        if (!isValidBirthDate(birthDate)) {
            CustomError.petError('INVALID_AGE');
        }
        
        const pet = PetDTO.getPetInputFrom({
            name,
            specie: specie.toLowerCase(),
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });
        
        const result = await petsService.create(pet);
        
        res.status(201).json({
            success: true,
            message: "Mascota creada exitosamente con imagen",
            payload: {
                id: result._id,
                name: result.name,
                specie: result.specie,
                birthDate: result.birthDate,
                image: result.image,
                adopted: result.adopted
            }
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}