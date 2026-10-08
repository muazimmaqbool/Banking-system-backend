const swaggerJsdoc = require("swagger-jsdoc")
const path = require("path")

const swaggerSpec = swaggerJsdoc({
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Backend API",
      version: "1.0.0",
      description: "API documentation for my backend",
    },
    servers: [
      { url: "/" },
    ],
  },
  apis: [
    path.join(__dirname, "../routes/**/*.js").replace(/\\/g, "/"),
  ],
});

module.exports = swaggerSpec;