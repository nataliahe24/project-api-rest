import { Router } from "express";
import {
  getGraphicsController,
  getAnalysisController,
} from "../controllers/analytics.controller.js";
import { globalErrorHandler } from "../middlewares/global.error.handle.js";

const router = Router();

/**
 * @openapi
 * /analytics/graphics:
 *   get:
 *     summary: Get aggregated data for graphics
 *     description: Returns project statistics grouped by status including counts and percentages
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Successful response with aggregated data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProjects:
 *                   type: number
 *                   example: 10
 *                 projectsByStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: "in progress"
 *                       count:
 *                         type: number
 *                         example: 6
 *                       percentage:
 *                         type: number
 *                         example: 60
 *                 completedProjects:
 *                   type: number
 *                   example: 4
 *                 inProgressProjects:
 *                   type: number
 *                   example: 6
 *       500:
 *         description: Internal server error
 */
router.get("/graphics", getGraphicsController);

/**
 * @openapi
 * /analytics/{id}:
 *   get:
 *     summary: Generate AI analysis of a specific project description
 *     description: Uses Google Gemini API to create an executive summary of a project's description
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Successful response with AI-generated analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   description: AI-generated executive summary
 *                 totalProjects:
 *                   type: number
 *                   example: 1
 *                 generatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error or AI service unavailable
 */
router.get("/:id", getAnalysisController);

router.use(globalErrorHandler);
export { router };
