import { fakerES_MX as faker } from "@faker-js/faker";
import { logger } from "../logger.js";

// Configuración de especies disponibles
const AVAILABLE_SPECIES = [
    'perro', 'gato', 'conejo', 'hamster', 'ave', 
    'pez', 'reptil' , 'otro'
];

// Configuración de URLs de imágenes por especie
const SPECIES_IMAGES = {
    'Perro': [
        'https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg',
        'https://images.dog.ceo/breeds/beagle/n02088364_1108.jpg',
        'https://images.dog.ceo/breeds/bulldog-french/n02108915_1123.jpg'
    ],
    'Gato': [
        'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg',
        'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
        'https://cdn2.thecatapi.com/images/bpc.jpg'
    ],
    'default': [
        'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Mascota',
        'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Pet',
        'https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=Animal'
    ]
};

/**
 * Genera un mock de mascota individual
 * @param {boolean} withOwner - Si debe incluir un owner (ObjectId)
 * @returns {Object} Objeto con datos de mascota generados
 */
export const generateSinglePet = () => {
// export const generateSinglePet = (withOwner = false) => {
    const specie = faker.helpers.arrayElement(AVAILABLE_SPECIES);
    const isAdopted = faker.datatype.boolean({ probability: 0.0 }); // 0% probabilidad de estar adoptado
    
    // Generar fecha de nacimiento (entre 6 meses y 10 años atrás)
    const birthDate = faker.date.between({ 
        from: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000), // 10 años atrás
        to: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)     // 6 meses atrás
    });

    // Seleccionar imagen según la especie
    const specieImages = SPECIES_IMAGES[specie] || SPECIES_IMAGES.default;
    const image = faker.helpers.arrayElement(specieImages);

    const pet = {
        name: faker.animal.petName(),
        specie: specie,
        birthDate: birthDate,
        adopted: isAdopted,
        image: image,
    };

    return pet;
};

/**
 * Genera múltiples mocks de mascotas
 * @param {number} dataQuantity - Cantidad de mascotas a generar
 * @returns {Promise<Array>} Array de objetos con datos de mascotas
 */
export const petMockGenerator = async (dataQuantity) => {
    try {

        const pets = [];
        
        for (let i = 0; i < dataQuantity; i++) {
            const newPet = await generateSinglePet();

            pets.push(newPet);
        }

        return pets;

    } catch (error) {
        logger.error('Error generando mocks de mascotas:', error);
        throw new Error(`Error al generar datos de prueba: ${error.message}`);
    }
};

/**
 * Genera mascotas con datos específicos para testing
 * @param {Object} overrides - Datos específicos a sobrescribir
 * @returns {Object} Mascota con datos específicos
 */
export const generatePetWithData = async (overrides = {}) => {
    const basePet = await generateSinglePet();
    return { ...basePet, ...overrides };
};

/**
 * Obtiene las especies disponibles
 * @returns {Array} Array de especies disponibles
 */
export const getAvailableSpecies = () => {
    return [...AVAILABLE_SPECIES];
};

export default {
    generateSinglePet,
    petMockGenerator,
    generatePetWithData,
    getAvailableSpecies
}
