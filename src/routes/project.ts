import { Router } from "express";
import type { Request, Response } from "express";
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectsController,
  updateProjectController,
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

/**
 * @openapi
 * /project:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - status
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [In progress, Completed]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  createProjectValidation,
  validateRequest,
  createProjectController
);

/**
 * @openapi
 * /project/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put(
  "/:id",
  updateProjectValidation,
  validateRequest,
  updateProjectController
);

/**
 * @openapi
 * /project/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not found
 */
router.delete("/:id", deleteProjectController);

router.use(globalErrorHandler);
export { router };
