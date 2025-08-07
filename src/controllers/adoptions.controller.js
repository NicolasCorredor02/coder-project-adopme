import { adoptionsService, petsService, usersService } from "../services/index.js";
import { CustomError } from "../utils/CustomError.js";
import mongoose from "mongoose";

// Validar formato de ObjectId de MongoDB
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const getAllAdoptions = async (req, res, next) => {
    try {
        const result = await adoptionsService.getAll();
        
        res.json({
            success: true,
            message: "Adopciones obtenidas exitosamente",
            payload: result
        });
        
    } catch (error) {
        next(error);
    }
};

const getAdoption = async (req, res, next) => {
    try {
        const adoptionId = req.params.aid;
        
        // Validar formato de ID
        if (!isValidObjectId(adoptionId)) {
            CustomError.validationError('INVALID_ID_FORMAT');
        }
        
        const adoption = await adoptionsService.getBy({ _id: adoptionId });
        if (!adoption) {
            CustomError.adoptionError('NOT_FOUND');
        }
        
        res.json({
            success: true,
            message: "Adopción encontrada",
            payload: {
                id: adoption._id,
                owner: adoption.owner,
                pet: adoption.pet,
                createdAt: adoption.createdAt || new Date()
            }
        });
        
    } catch (error) {
        next(error);
    }
};

const createAdoption = async (req, res, next) => {
    try {
        const { uid, pid } = req.params;
        
        // Validar formato de IDs
        if (!isValidObjectId(uid)) {
            CustomError.validationError('INVALID_ID_FORMAT', 'El ID del usuario no es válido');
        }
        
        if (!isValidObjectId(pid)) {
            CustomError.validationError('INVALID_ID_FORMAT', 'El ID de la mascota no es válido');
        }
        
        // Verificar que el usuario existe
        const user = await usersService.getUserById(uid);
        if (!user) {
            CustomError.adoptionError('USER_NOT_FOUND');
        }
        
        // Verificar que la mascota existe
        const pet = await petsService.getBy({ _id: pid });
        if (!pet) {
            CustomError.adoptionError('PET_NOT_FOUND');
        }
        
        // Verificar que la mascota no esté ya adoptada
        if (pet.adopted) {
            CustomError.adoptionError('PET_NOT_AVAILABLE');
        }
        
        // Verificar que el usuario no esté adoptando su propia mascota (si hay campo owner)
        if (pet.owner && pet.owner.toString() === uid) {
            CustomError.adoptionError('SELF_ADOPTION');
        }
        
        // Verificar que no exista ya una adopción entre este usuario y esta mascota
        const existingAdoption = await adoptionsService.getBy({ owner: uid, pet: pid });
        if (existingAdoption) {
            CustomError.adoptionError('ALREADY_EXISTS');
        }
        
        // Verificar que el usuario no tenga ya esta mascota en su lista
        const userPetIds = user.pets.map(petId => petId.toString());
        if (userPetIds.includes(pid)) {
            CustomError.adoptionError('ALREADY_EXISTS', 'El usuario ya tiene esta mascota');
        }
        
        // Iniciar proceso de adopción (usar transacción para consistencia)
        const session = await mongoose.startSession();
        
        try {
            await session.withTransaction(async () => {
                // Actualizar usuario: agregar mascota a su lista
                user.pets.push(pet._id);
                await usersService.update(user._id, { pets: user.pets });
                
                // Actualizar mascota: marcar como adoptada y asignar dueño
                await petsService.update(pet._id, { adopted: true, owner: user._id });
                
                // Crear registro de adopción
                await adoptionsService.create({ owner: user._id, pet: pet._id });
            });
            
            await session.endSession();
            
            res.status(201).json({
                success: true,
                message: "Adopción realizada exitosamente",
                payload: {
                    adoptionDetails: {
                        owner: {
                            id: user._id,
                            name: `${user.first_name} ${user.last_name}`,
                            email: user.email
                        },
                        pet: {
                            id: pet._id,
                            name: pet.name,
                            specie: pet.specie
                        },
                        adoptedAt: new Date()
                    }
                }
            });
            
        } catch (transactionError) {
            await session.endSession();
            CustomError.adoptionError('CREATION_FAILED', 'Error al procesar la adopción');
        }
        
    } catch (error) {
        next(error);
    }
};

// Nuevo endpoint para obtener adopciones por usuario
const getAdoptionsByUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        
        // Validar formato de ID
        if (!isValidObjectId(userId)) {
            CustomError.validationError('INVALID_ID_FORMAT');
        }
        
        // Verificar que el usuario existe
        const user = await usersService.getUserById(userId);
        if (!user) {
            CustomError.userError('NOT_FOUND');
        }
        
        const adoptions = await adoptionsService.getAll({ owner: userId });
        
        res.json({
            success: true,
            message: "Adopciones del usuario obtenidas exitosamente",
            payload: adoptions
        });
        
    } catch (error) {
        next(error);
    }
};

// Nuevo endpoint para obtener adopciones por mascota
// const getAdoptionsByPet = async (req, res, next) => {
//     try {
//         const petId = req.params.pid;
        
//         // Validar formato de ID
//         if (!isValidObjectId(petId)) {
//             CustomError.validationError('INVALID_ID_FORMAT');
//         }
        
//         // Verificar que la mascota existe
//         const pet = await petsService.getBy({ _id: petId });
//         if (!pet) {
//             CustomError.petError('NOT_FOUND');
//         }
        
//         const adoptions = await adoptionsService.getAll({ pet: petId });
        
//         res.json({
//             success: true,
//             message: "Adopciones de la mascota obtenidas exitosamente",
//             payload: adoptions
//         });
        
//     } catch (error) {
//         next(error);
//     }
// };

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption,
    getAdoptionsByUser,
    // getAdoptionsByPet
};
