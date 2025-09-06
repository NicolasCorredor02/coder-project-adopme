import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'AdopMe API Documentation',
      version: '1.0.0',
      description: 'API for the AdopMe application, a platform for pet adoption.',
    },
  },
    apis: ['./src/docs/**/*.yaml'], // Rutas a los archivos que contienen la documentación
};

export const specs = swaggerJSDoc(swaggerOptions);
