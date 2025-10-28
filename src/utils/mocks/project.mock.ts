import type { Project } from "../../interfaces/project.interface.js";

export const mockProjectFactory = (
  overrides: Partial<Project> = {}
): Project => {
  return {
    id: "1",
    name: "Project 1",
    description: "Description 1",
    status: "in progress",
    startDate: new Date("2025-01-01"),
    ...overrides,
  };
};

export const mockProjectWithDatesFactory = (
  overrides: Partial<Project & { createdAt: Date; updatedAt: Date }> = {}
): Project & { createdAt: Date; updatedAt: Date } => {
  return {
    ...mockProjectFactory(overrides),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const createMultipleProjects = (
  count: number,
  baseOverrides: Partial<Project> = {}
) => {
  const projects: Project[] = [];
  for (let i = 1; i <= count; i++) {
    projects.push(
      mockProjectFactory({
        id: i.toString(),
        name: `Project ${i}`,
        description: `Description for project ${i}`,
        ...baseOverrides,
      })
    );
  }
  return projects;
};
