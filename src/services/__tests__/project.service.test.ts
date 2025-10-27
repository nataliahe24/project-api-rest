import { beforeEach, describe, expect, test, jest } from "@jest/globals";
import { AppError } from "../../utils/app.error.js";
import type { Project } from "../../interfaces/project.interface.js";
import { mockPrismaClient } from "../../utils/mocks/prisma.js";
import { mockProjects } from "../../utils/mocks/project.mock.js";

jest.mock("../../generated/prisma/client.js");

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = await import("../project.service.js");

const mockFindMany = mockPrismaClient.project.findMany;
const mockFindUnique = mockPrismaClient.project.findUnique;
const mockCreate = mockPrismaClient.project.create;
const mockUpdate = mockPrismaClient.project.update;
const mockDelete = mockPrismaClient.project.delete;

describe("Project Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProjects", () => {
    test("should return all projects", async () => {
      mockFindMany.mockResolvedValue(mockProjects as never);

      const result = await getProjects();

      expect(result).toEqual(mockProjects);
      expect(mockFindMany).toHaveBeenCalledTimes(1);
    });

    test("should return empty array when no projects exist", async () => {
      mockFindMany.mockResolvedValue([] as never);

      const result = await getProjects();

      expect(result).toEqual([]);
      expect(mockFindMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProjectById", () => {
    test("should return a project by id", async () => {
      mockFindUnique.mockResolvedValue(mockProjects[0] as never);

      const result = await getProjectById(1);

      expect(result).toEqual(mockProjects[0]);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should throw AppError when project not found", async () => {
      mockFindUnique.mockResolvedValue(null as never);

      await expect(getProjectById(999)).rejects.toThrow(AppError);
      await expect(getProjectById(999)).rejects.toThrow("Project not found");

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    test("should throw AppError with correct properties", async () => {
      mockFindUnique.mockResolvedValue(null as never);

      try {
        await getProjectById(999);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).type).toBe("NotFoundError");
      }
    });
  });

  describe("createProject", () => {
    test("should create a project with status in progress", async () => {
      const projectInput: Project = {
        id: "1",
        name: "New Project",
        description: "Test Description",
        status: "in progress",
        startDate: new Date("2025-01-01"),
      };

      const mockCreatedProject = {
        id: 1,
        name: "New Project",
        description: "Test Description",
        status: "in progress",
        startDate: new Date("2025-01-01"),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockCreatedProject as never);

      const result = await createProject(projectInput);

      expect(result).toEqual(mockCreatedProject);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: "New Project",
          description: "Test Description",
          status: "in progress",
          startDate: projectInput.startDate,
          endDate: null,
        },
      });
    });

    test("should create completed project with endDate", async () => {
      const projectInput: Project = {
        id: "1",
        name: "Completed Project",
        description: "Test Description",
        status: "completed",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
      };

      const mockCreatedProject = {
        id: 1,
        name: "Completed Project",
        description: "Test Description",
        status: "completed",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockCreatedProject as never);

      const result = await createProject(projectInput);

      expect(result).toEqual(mockCreatedProject);
      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "Completed Project",
          status: "completed",
          endDate: expect.any(Date),
        }),
      });
    });

    test("should throw when completed status missing endDate", async () => {
      const projectInput: Project = {
        id: "1",
        name: "Invalid Project",
        description: "Test Description",
        status: "completed",
        startDate: new Date("2025-01-01"),
      };

      await expect(createProject(projectInput)).rejects.toThrow(
        "End date is required when status is Completed"
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    test("should throw when in progress has endDate", async () => {
      const projectInput: Project = {
        id: "1",
        name: "Invalid Project",
        description: "Test Description",
        status: "in progress",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
      };

      await expect(createProject(projectInput)).rejects.toThrow(
        "End date is not allowed when status is In Progress"
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("updateProject", () => {
    test("should update project successfully", async () => {
      const projectUpdate: Project = {
        id: "1",
        name: "Updated Project",
        description: "Updated Description",
        status: "in progress",
        startDate: new Date("2025-01-01"),
      };

      const mockUpdatedProject = {
        id: 1,
        name: "Updated Project",
        description: "Updated Description",
        status: "in progress",
        startDate: new Date("2025-01-01"),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdate.mockResolvedValue(mockUpdatedProject as never);

      const result = await updateProject(1, projectUpdate);

      expect(result).toEqual(mockUpdatedProject);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: "Updated Project",
          description: "Updated Description",
          status: "in progress",
          startDate: projectUpdate.startDate,
          endDate: null,
        },
      });
    });

    test("should update status from in progress to completed", async () => {
      const projectUpdate: Project = {
        id: "1",
        name: "Finished Project",
        description: "Test Description",
        status: "completed",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
      };

      const mockUpdatedProject = {
        id: 1,
        name: "Finished Project",
        description: "Test Description",
        status: "completed",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdate.mockResolvedValue(mockUpdatedProject as never);

      const result = await updateProject(1, projectUpdate);

      expect(result.status).toBe("completed");
      expect(result.endDate).toBeTruthy();
    });

    test("should throw when updating to completed without endDate", async () => {
      const projectUpdate: Project = {
        id: "1",
        name: "Invalid Update",
        description: "Test Description",
        status: "completed",
        startDate: new Date("2025-01-01"),
      };

      await expect(updateProject(1, projectUpdate)).rejects.toThrow(
        "End date is required when status is Completed"
      );
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    test("should normalize status to lowercase", async () => {
      const projectUpdate: Project = {
        id: "1",
        name: "Project",
        description: "Test Description",
        status: "in progress",
        startDate: new Date("2025-01-01"),
      };

      const mockUpdatedProject = {
        id: 1,
        name: "Project",
        description: "Test Description",
        status: "in progress",
        startDate: new Date("2025-01-01"),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdate.mockResolvedValue(mockUpdatedProject as never);

      await updateProject(1, projectUpdate);

      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe("deleteProject", () => {
    test("should delete project successfully", async () => {
      mockFindUnique.mockResolvedValue(mockProjects[0] as never);
      mockDelete.mockResolvedValue(mockProjects[0] as never);

      const result = await deleteProject(1);

      expect(result).toEqual(mockProjects[0]);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should throw AppError when project not found", async () => {
      mockFindUnique.mockResolvedValue(null as never);

      await expect(deleteProject(999)).rejects.toThrow(AppError);
      await expect(deleteProject(999)).rejects.toThrow("Project not found");

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    test("should verify project exists before deletion", async () => {
      mockFindUnique.mockResolvedValue(null as never);

      try {
        await deleteProject(1);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).type).toBe("NotFoundError");
      }

      expect(mockDelete).not.toHaveBeenCalled();
    });
  });
});
