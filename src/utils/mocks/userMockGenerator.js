import { fakerES_MX as faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// Configuración de roles disponibles
const AVAILABLE_ROLES = ['user', 'admin'];

// Configuracion de password estatica
const AVALIBLE_PASSWORD = 'coder123';

// Configuración de dominios de email comunes
const EMAIL_DOMAINS = [
    'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com',
    'correo.com', 'email.com', 'test.com'
];

/**
 * Genera una contraseña hasheada
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Contraseña hasheada
 */
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Genera un email único basado en nombre y apellido
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido
 * @param {Array} existingEmails - Emails ya existentes para evitar duplicados
 * @returns {string} Email único generado
 */
const generateUniqueEmail = (firstName, lastName, existingEmails = []) => {
    const domain = faker.helpers.arrayElement(EMAIL_DOMAINS);
    const firstNameTransform = firstName.split(" ")[0];
    const lastNameTransform = lastName.split(" ")[0];
    const baseEmail = `${firstNameTransform.toLowerCase()}.${lastNameTransform.toLowerCase()}@${domain}`;
    
    let email = baseEmail;
    let counter = 1;
    
    // Asegurar que el email sea único
    while (existingEmails.includes(email)) {
        email = `${firstNameTransform.toLowerCase()}.${lastNameTransform.toLowerCase()}${counter}@${domain}`;
        counter++;
    }
    
    return email;
};


/**
 * Genera un mock de usuario individual
 * @param {Object} options - Opciones de configuración
 * @returns {Promise<Object>} Objeto con datos de usuario generados
 */
export const generateSingleUser = async (existingEmails) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = generateUniqueEmail(firstName, lastName, existingEmails);;
    const userRole = faker.helpers.arrayElement(AVAILABLE_ROLES);
    
    // Hashear la contraseña
    const hashedPassword = await hashPassword(AVALIBLE_PASSWORD);

    const user = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        role: userRole,
        pets: []
    };

    return user;
};

/**
 * Genera múltiples mocks de usuarios
 * @param {number} dataQuantity - Cantidad de usuarios a generar
 * @returns {Promise<Array>} Array de objetos con datos de usuarios
 */
export const userMockGenerator = async (dataQuantity) => {
    try {

        const createdEmails = [];
        const users = [];

        for (let i = 0; i < dataQuantity; i++) {
            const newUser = await generateSingleUser(createdEmails); // Se ingresa el array de emails existentes para no generar emails duplicados
            createdEmails.push(newUser.email); // Luego de la creacion de un nuevo usuario se agrega el correo generado en el array para ser validado en la siguiente iteracion
            users.push(newUser);
        }

        return users;

    } catch (error) {
        console.error('Error generando mocks de usuarios:', error);
        throw new Error(`Error al generar datos de prueba de usuarios: ${error.message}`);
    }
};

/**
 * Genera usuarios con roles específicos
 * @param {string} role - Rol específico ('user' o 'admin')
 * @param {number} quantity - Cantidad a generar
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Array>} Array de usuarios con el rol especificado
 */
export const generateUsersByRole = async (role, quantity = 1, options = {}) => {
    const users = [];
    
    for (let i = 0; i < quantity; i++) {
        const user = await generateSingleUser({
            role: role,
            ...options
        });
        users.push(user);
    }
    
    return users;
};

/**
 * Genera un usuario administrador específico
 * @param {Object} overrides - Datos específicos a sobrescribir
 * @returns {Promise<Object>} Usuario administrador generado
 */
export const generateAdmin = async (overrides = {}) => {
    const baseUser = await generateSingleUser({ 
        role: 'admin',
        customPassword: 'admin123'
    });
    return { ...baseUser, ...overrides };
};


/**
 * Obtiene los roles disponibles
 * @returns {Array} Array de roles disponibles
 */
export const getAvailableRoles = () => {
    return [...AVAILABLE_ROLES];
};


export default {
    generateSingleUser,
    userMockGenerator,
    generateUsersByRole,
    generateAdmin,
    getAvailableRoles,
};
