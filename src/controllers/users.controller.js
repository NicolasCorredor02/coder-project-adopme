import { usersService } from "../services/index.js";
import { CustomError } from "../utils/CustomError.js";
import mongoose from "mongoose";

// Validar formato de ObjectId de MongoDB
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersService.getAll();
        
        res.json({
            success: true,
            message: "Usuarios obtenidos exitosamente",
            payload: users
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        
        // Validar formato de ID
        if (!isValidObjectId(userId)) {
            CustomError.validationError('INVALID_ID_FORMAT');
        }
        
        const user = await usersService.getUserById(userId);
        if (!user) {
            CustomError.userError('NOT_FOUND');
        }
        
        res.json({
            success: true,
            message: "Usuario encontrado",
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                pets: user.pets
            }
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        
        // Validar formato de ID
        if (!isValidObjectId(userId)) {
            CustomError.validationError('INVALID_ID_FORMAT');
        }
        
        // Validar que el cuerpo no esté vacío
        if (Object.keys(updateBody).length === 0) {
            CustomError.validationError('INVALID_REQUEST_BODY', 'El cuerpo de la petición no puede estar vacío');
        }
        
        // Verificar que el usuario existe
        const user = await usersService.getUserById(userId);
        if (!user) {
            CustomError.userError('NOT_FOUND');
        }
        
        // Validar email si se está actualizando
        if (updateBody.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updateBody.email)) {
                CustomError.userError('INVALID_EMAIL');
            }
            
            // Verificar que el email no esté en uso por otro usuario
            const existingUser = await usersService.getUserByEmail(updateBody.email);
            if (existingUser && existingUser._id.toString() !== userId) {
                CustomError.userError('ALREADY_EXISTS', 'El email ya está en uso por otro usuario');
            }
        }
        
        // Validar contraseña si se está actualizando
        if (updateBody.password && updateBody.password.length < 8) {
            CustomError.userError('WEAK_PASSWORD');
        }
        
        const result = await usersService.update(userId, updateBody);
        if (!result) {
            CustomError.userError('UPDATE_FAILED');
        }
        
        res.json({
            success: true,
            message: "Usuario actualizado exitosamente",
            payload: {
                id: result._id,
                first_name: result.first_name,
                last_name: result.last_name,
                email: result.email,
                role: result.role
            }
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
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
        
        // Eliminar el usuario
        const result = await usersService.delete(userId);
        if (!result) {
            CustomError.userError('DELETE_FAILED');
        }
        
        res.json({
            success: true,
            message: "Usuario eliminado exitosamente",
            payload: {
                deletedUserId: userId
            }
        });
        
    } catch (error) {
        req.logger.error(`Error: ${error.message}`);
        next(error);
    }
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}