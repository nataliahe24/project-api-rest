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

export const createProject = async (project: Project) => {
  const status = project.status.toLowerCase();
  const endDate = project.endDate?.toString();
  const endDateValue = DateIsRequired(status as ProjectStatus, endDate);
  const data = {
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.startDate,
    endDate: endDateValue,
  };
  const newProject = await prisma.project.create({
    data,
  });

  return newProject;
};

export const updateProject = async (id: number, project: Project) => {
  const status = project.status.toLowerCase();
  const endDate = project.endDate?.toString();
  const endDateValue = DateIsRequired(status as ProjectStatus, endDate);
  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: endDateValue,
    },
  });
  return updatedProject;
};

export const deleteProject = async (id: number) => {
  const deletedProject = await prisma.project.findUnique({ where: { id } });
  if (!deletedProject) {
    throw new AppError("Project not found", 404, "NotFoundError");
  }
  await prisma.project.delete({ where: { id } });
  return deletedProject;
};
