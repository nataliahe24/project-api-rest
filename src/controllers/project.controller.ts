import type { Request, Response, NextFunction } from "express";
import { getProjects, getProjectById } from "../services/project.service.js";

export const getProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await getProjectById(Number(req.params.id));
    res.json(project);
  } catch (error) {
    next(error);
  }
};
