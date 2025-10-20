import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import specs from "./configurations/swagger.js";
import { router } from "./routes/index.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
