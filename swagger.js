const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management System API',
      version: '1.0.0',
      description: 'API documentation for the Task Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API route files
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

swaggerOptions.components = {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Task 1' },
          description: { type: 'string', example: 'This is Task 1' },
          status: { type: 'string', enum: ['in progress', 'completed', 'pending'], example: 'in progress' },
          dueDate: { type: 'string', format: 'date', example: '2023-07-31' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Error message' },
        },
      },
    },
  };

module.exports = {
  swaggerUi,
  swaggerSpecs,
};
