import type { Request, Response, NextFunction } from "express";
import {
  getGraphicsData,
  generateAnalysis,
} from "../services/analytics.service.js";

/**
 * Controller to get aggregated data for graphics
 * Returns project statistics grouped by status
 */
export const getGraphicsController= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getGraphicsData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to generate AI analysis of a specific project
 * Uses Google Gemini API to create a summary
 */
export const getAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = Number(req.params.id);
    const analysis = await generateAnalysis(projectId);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};
