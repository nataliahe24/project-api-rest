import type { Project } from "../interfaces/project.interface.js";
import type {
  Project as PrismaProject,
  Prisma,
} from "../../generated/prisma/client.js";
import { PrismaClient } from "../../generated/prisma/client.js";
import { DateIsRequired } from "../utils/validate.date.js";
import type { ProjectStatus } from "../interfaces/project.interface.js";
import { AppError } from "../utils/app.error.js";

const prisma = new PrismaClient();

export const getProjects = async () => {
  const projects = await prisma.project.findMany();
  return projects;
};

export const getProjectById = async (id: number) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError("Project not found", 404, "NotFoundError");
  }
  return project;
};
