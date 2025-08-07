import { ERRORS } from '../utils/Errors.js';

export const errorHandler = (error, req, res, next) => {
    console.error(`Error: ${error.name} - ${error.message}`);
    console.error('Stack trace:', error.stack);
    
    res.setHeader('Content-Type', 'application/json');
    
    // Si es un error personalizado con código, usarlo
    if (error.code && error.name) {
        return res.status(error.code).json({
            success: false,
            error: {
                name: error.name,
                message: error.message,
                cause: error.cause || 'Error no especificado',
                timestamp: new Date().toISOString(),
                path: req.path
            }
        });
    }
    
    // Si es un error de MongoDB
    if (error.code === 11000) {
        const duplicateError = ERRORS.DATABASE.DUPLICATE_KEY;
        return res.status(duplicateError.code).json({
            success: false,
            error: {
                name: duplicateError.name,
                message: duplicateError.message,
                cause: 'Valor duplicado en la base de datos',
                timestamp: new Date().toISOString(),
                path: req.path
            }
        });
    }
    
    // Si es un error de validación de Mongoose
    if (error.name === 'ValidationError') {
        const validationError = ERRORS.VALIDATION.REQUIRED_FIELDS_MISSING;
        return res.status(validationError.code).json({
            success: false,
            error: {
                name: validationError.name,
                message: validationError.message,
                cause: error.message,
                timestamp: new Date().toISOString(),
                path: req.path
            }
        });
    }
    
    // Si es un error de ID inválido de MongoDB
    if (error.name === 'CastError') {
        const castError = ERRORS.VALIDATION.INVALID_ID_FORMAT;
        return res.status(castError.code).json({
            success: false,
            error: {
                name: castError.name,
                message: castError.message,
                cause: 'El ID proporcionado no es válido',
                timestamp: new Date().toISOString(),
                path: req.path
            }
        });
    }
    
    // Error genérico del servidor
    const serverError = ERRORS.SERVER.INTERNAL_ERROR;
    return res.status(serverError.code).json({
        success: false,
        error: {
            name: serverError.name,
            message: serverError.message,
            cause: error.message || 'Error interno no especificado',
            timestamp: new Date().toISOString(),
            path: req.path
        }
    });
};
