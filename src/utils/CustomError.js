import { ERRORS } from './Errors.js';

export class CustomError {
    // Método que usa el sistema de errores
    static throwError(errorType, customMessage = null, customCause = null) {
        const error = new Error(customMessage || errorType.message);
        
        error.name = errorType.name;
        error.code = errorType.code;
        error.cause = customCause || errorType.cause;
        error.custom = true;
        
        throw error;
    }
    
    // Método para crear error de autenticación
    static authError(type = 'INVALID_CREDENTIALS', customMessage = null) {
        this.throwError(ERRORS.AUTH[type], customMessage);
    }
    
    // Método para crear error de usuario
    static userError(type = 'NOT_FOUND', customMessage = null) {
        this.throwError(ERRORS.USER[type], customMessage);
    }
    
    // Método para crear error de mascota
    static petError(type = 'NOT_FOUND', customMessage = null) {
        this.throwError(ERRORS.PET[type], customMessage);
    }
    
    // Método para crear error de adopción
    static adoptionError(type = 'NOT_FOUND', customMessage = null) {
        this.throwError(ERRORS.ADOPTION[type], customMessage);
    }
    
    // Método para crear error de validación
    static validationError(type = 'REQUIRED_FIELDS_MISSING', customMessage = null) {
        this.throwError(ERRORS.VALIDATION[type], customMessage);
    }
}
