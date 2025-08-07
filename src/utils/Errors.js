export const ERRORS = {
    // ============= ERRORES DE AUTENTICACIÓN Y AUTORIZACIÓN =============
    AUTH: {
        INVALID_CREDENTIALS: {
            name: "AuthenticationError",
            message: "Email o contraseña incorrectos",
            code: 401,
            cause: "Las credenciales proporcionadas no son válidas"
        },
        TOKEN_INVALID: {
            name: "AuthenticationError", 
            message: "Token de autenticación inválido o expirado",
            code: 401,
            cause: "El token JWT no es válido o ha expirado"
        },
        TOKEN_MISSING: {
            name: "AuthenticationError",
            message: "Token de autenticación requerido",
            code: 401,
            cause: "No se proporcionó token de autenticación"
        },
        ACCESS_DENIED: {
            name: "AuthorizationError",
            message: "Acceso denegado. Permisos insuficientes",
            code: 403,
            cause: "El usuario no tiene permisos para realizar esta acción"
        },
        SESSION_EXPIRED: {
            name: "AuthenticationError",
            message: "La sesión ha expirado",
            code: 401,
            cause: "La sesión del usuario ha expirado"
        }
    },

    // ============= ERRORES DE USUARIOS =============
    USER: {
        NOT_FOUND: {
            name: "UserNotFoundError",
            message: "Usuario no encontrado",
            code: 404,
            cause: "El usuario con el ID especificado no existe"
        },
        ALREADY_EXISTS: {
            name: "UserExistsError",
            message: "El usuario ya existe",
            code: 409,
            cause: "Ya existe un usuario registrado con este email"
        },
        INVALID_DATA: {
            name: "UserValidationError",
            message: "Datos de usuario inválidos",
            code: 400,
            cause: "Los datos proporcionados no cumplen con los requisitos"
        },
        WEAK_PASSWORD: {
            name: "UserValidationError",
            message: "La contraseña debe tener al menos 8 caracteres",
            code: 400,
            cause: "La contraseña no cumple con los requisitos de seguridad"
        },
        INVALID_EMAIL: {
            name: "UserValidationError",
            message: "El formato del email no es válido",
            code: 400,
            cause: "El email proporcionado no tiene un formato válido"
        },
        UPDATE_FAILED: {
            name: "UserUpdateError",
            message: "No se pudo actualizar el usuario",
            code: 500,
            cause: "Error interno al intentar actualizar los datos del usuario"
        },
        DELETE_FAILED: {
            name: "UserDeleteError",
            message: "No se pudo eliminar el usuario",
            code: 500,
            cause: "Error interno al intentar eliminar el usuario"
        }
    },

    // ============= ERRORES DE MASCOTAS =============
    PET: {
        NOT_FOUND: {
            name: "PetNotFoundError",
            message: "Mascota no encontrada",
            code: 404,
            cause: "La mascota con el ID especificado no existe"
        },
        ALREADY_ADOPTED: {
            name: "PetNotAvailableError",
            message: "La mascota ya ha sido adoptada",
            code: 409,
            cause: "Esta mascota ya tiene un dueño"
        },
        INVALID_DATA: {
            name: "PetValidationError",
            message: "Datos de mascota inválidos",
            code: 400,
            cause: "Los datos de la mascota no son válidos"
        },
        MISSING_REQUIRED_FIELDS: {
            name: "PetValidationError",
            message: "Faltan campos requeridos (nombre, especie, birthDate)",
            code: 400,
            cause: "No se proporcionaron todos los campos obligatorios"
        },
        INVALID_SPECIES: {
            name: "PetValidationError",
            message: "Especie no válida",
            code: 400,
            cause: "La especie debe ser perro, gato u otro animal válido"
        },
        INVALID_AGE: {
            name: "PetValidationError",
            message: "Fecha de nacimiento inválida",
            code: 400,
            cause: "La fecha de nacimiento no puede ser futura"
        },
        IMAGE_UPLOAD_FAILED: {
            name: "PetImageError",
            message: "Error al subir la imagen de la mascota",
            code: 500,
            cause: "No se pudo procesar o guardar la imagen"
        },
        INVALID_IMAGE_FORMAT: {
            name: "PetImageError",
            message: "Formato de imagen no válido",
            code: 400,
            cause: "Solo se permiten imágenes en formato JPG, PNG o GIF"
        },
        UPDATE_FAILED: {
            name: "PetUpdateError",
            message: "No se pudo actualizar la mascota",
            code: 500,
            cause: "Error interno al intentar actualizar los datos de la mascota"
        },
        DELETE_FAILED: {
            name: "PetDeleteError",
            message: "No se pudo eliminar la mascota",
            code: 500,
            cause: "Error interno al intentar eliminar la mascota"
        }
    },

    // ============= ERRORES DE ADOPCIONES =============
    ADOPTION: {
        NOT_FOUND: {
            name: "AdoptionNotFoundError",
            message: "Adopción no encontrada",
            code: 404,
            cause: "La adopción con el ID especificado no existe"
        },
        ALREADY_EXISTS: {
            name: "AdoptionExistsError",
            message: "Ya existe una adopción entre este usuario y mascota",
            code: 409,
            cause: "Este usuario ya adoptó esta mascota"
        },
        USER_NOT_FOUND: {
            name: "AdoptionValidationError",
            message: "Usuario adoptante no encontrado",
            code: 404,
            cause: "El usuario especificado para la adopción no existe"
        },
        PET_NOT_FOUND: {
            name: "AdoptionValidationError",
            message: "Mascota no encontrada para adopción",
            code: 404,
            cause: "La mascota especificada para adopción no existe"
        },
        PET_NOT_AVAILABLE: {
            name: "AdoptionValidationError",
            message: "La mascota no está disponible para adopción",
            code: 409,
            cause: "La mascota ya ha sido adoptada por otro usuario"
        },
        SELF_ADOPTION: {
            name: "AdoptionValidationError",
            message: "No se puede adoptar una mascota propia",
            code: 400,
            cause: "El usuario no puede adoptar una mascota que ya posee"
        },
        CREATION_FAILED: {
            name: "AdoptionCreationError",
            message: "No se pudo procesar la adopción",
            code: 500,
            cause: "Error interno al procesar la solicitud de adopción"
        }
    },

    // ============= ERRORES GENERALES DE VALIDACIÓN =============
    VALIDATION: {
        REQUIRED_FIELDS_MISSING: {
            name: "ValidationError",
            message: "Faltan campos obligatorios",
            code: 400,
            cause: "No se proporcionaron todos los campos requeridos"
        },
        INVALID_ID_FORMAT: {
            name: "ValidationError",
            message: "Formato de ID inválido",
            code: 400,
            cause: "El ID proporcionado no tiene un formato válido de MongoDB"
        },
        INVALID_REQUEST_BODY: {
            name: "ValidationError",
            message: "Cuerpo de la petición inválido",
            code: 400,
            cause: "El formato JSON del cuerpo de la petición no es válido"
        },
        INVALID_QUERY_PARAMS: {
            name: "ValidationError",
            message: "Parámetros de consulta inválidos",
            code: 400,
            cause: "Los parámetros de la URL no son válidos"
        }
    },

    // ============= ERRORES DE BASE DE DATOS =============
    DATABASE: {
        CONNECTION_ERROR: {
            name: "DatabaseConnectionError",
            message: "Error de conexión con la base de datos",
            code: 503,
            cause: "No se pudo establecer conexión con MongoDB"
        },
        OPERATION_FAILED: {
            name: "DatabaseOperationError",
            message: "Error en la operación de base de datos",
            code: 500,
            cause: "La operación en la base de datos falló"
        },
        DUPLICATE_KEY: {
            name: "DatabaseDuplicateError",
            message: "Valor duplicado detectado",
            code: 409,
            cause: "El valor ya existe en la base de datos"
        },
        TRANSACTION_FAILED: {
            name: "DatabaseTransactionError",
            message: "Error en la transacción de base de datos",
            code: 500,
            cause: "La transacción no pudo completarse correctamente"
        }
    },

    // ============= ERRORES DEL SERVIDOR =============
    SERVER: {
        INTERNAL_ERROR: {
            name: "InternalServerError",
            message: "Error interno del servidor",
            code: 500,
            cause: "Ha ocurrido un error interno inesperado"
        },
        SERVICE_UNAVAILABLE: {
            name: "ServiceUnavailableError",
            message: "Servicio no disponible temporalmente",
            code: 503,
            cause: "El servicio no está disponible en este momento"
        },
        TIMEOUT: {
            name: "TimeoutError",
            message: "Tiempo de espera agotado",
            code: 408,
            cause: "La operación tardó demasiado tiempo en completarse"
        },
        RATE_LIMIT_EXCEEDED: {
            name: "RateLimitError",
            message: "Límite de peticiones excedido",
            code: 429,
            cause: "Se han hecho demasiadas peticiones en poco tiempo"
        }
    },

    // ============= ERRORES DE ARCHIVOS =============
    FILE: {
        UPLOAD_FAILED: {
            name: "FileUploadError",
            message: "Error al subir el archivo",
            code: 500,
            cause: "No se pudo procesar la subida del archivo"
        },
        FILE_TOO_LARGE: {
            name: "FileSizeError",
            message: "El archivo es demasiado grande",
            code: 413,
            cause: "El tamaño del archivo excede el límite permitido"
        },
        INVALID_FILE_TYPE: {
            name: "FileTypeError",
            message: "Tipo de archivo no permitido",
            code: 400,
            cause: "El tipo de archivo no está permitido"
        },
        FILE_NOT_FOUND: {
            name: "FileNotFoundError",
            message: "Archivo no encontrado",
            code: 404,
            cause: "El archivo especificado no existe"
        }
    }
};

// ============= FUNCIÓN HELPER PARA CREAR ERRORES =============
export const createError = (errorType, customMessage = null, customCause = null) => {
    const error = {
        name: errorType.name,
        message: customMessage || errorType.message,
        code: errorType.code,
        cause: customCause || errorType.cause
    };
    
    return error;
};

// ============= FUNCIÓN PARA OBTENER ERROR POR CÓDIGO =============
export const getErrorByCode = (code) => {
    for (const category in ERRORS) {
        for (const errorKey in ERRORS[category]) {
            if (ERRORS[category][errorKey].code === code) {
                return ERRORS[category][errorKey];
            }
        }
    }
    return ERRORS.SERVER.INTERNAL_ERROR;
};
