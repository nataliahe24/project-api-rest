import { Router } from "express";
import type { Request, Response } from "express";
import {
  getProjectByIdController,
  getProjectsController,
} from "../controllers/project.controller.js";
import {
  createProjectValidation,
  updateProjectValidation,
} from "../middlewares/body.validation.js";
import { validateRequest } from "../middlewares/validate.request.js";
import { globalErrorHandler } from "../middlewares/global.error.handle.js";
import { body } from "express-validator";

const router = Router();

/**
 * @openapi
 * /project:
 *   get:
 *     summary: Get all projects
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get("/", getProjectsController);

/**
 * @openapi
 * /project/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get("/:id", getProjectByIdController);

router.use(globalErrorHandler);
export { router };
