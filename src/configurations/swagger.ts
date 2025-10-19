import swaggerJSDoc, { type Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project API",
      version: "1.0.0",
      description: "API for managing projects",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJSDoc(options);
export default specs;
