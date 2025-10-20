import type { Request, Response, NextFunction } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../services/project.service.js";

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

export const createProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await updateProject(Number(req.params.id), req.body);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await deleteProject(Number(req.params.id));
    res.json(project);
  } catch (error) {
    next(error);
  }
};
