import {
  beforeEach,
  afterEach,
  describe,
  expect,
  test,
  jest,
} from "@jest/globals";
import { AppError } from "../../utils/app.error.js";
import { mockPrismaClient } from "../../utils/mocks/prisma.js";
import { mockProjects } from "../../utils/mocks/project.mock.js";
import {
  mockGenerateContent,
  mockGetGenerativeModel,
  mockGoogleGenerativeAI,
} from "../../utils/mocks/google-ai.mock.js";

jest.mock("../../generated/prisma/client.js");

jest.unstable_mockModule("@google/generative-ai", () => ({
  GoogleGenerativeAI: mockGoogleGenerativeAI,
}));

const { getGraphicsData, generateAnalysis } = await import(
  "../analytics.service.js"
);

const mockFindMany = mockPrismaClient.project.findMany;
const mockFindUnique = mockPrismaClient.project.findUnique;

describe("Analytics Service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.GEMINI_API_KEY = "test-api-key";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getGraphicsData", () => {
    test("should return empty data when no projects exist", async () => {
      mockFindMany.mockResolvedValue([] as never);

      const result = await getGraphicsData();

      expect(result).toEqual({
        totalProjects: 0,
        projectsByStatus: [],
        completedProjects: 0,
        inProgressProjects: 0,
      });
      expect(mockFindMany).toHaveBeenCalledTimes(1);
    });

    test("should calculate statistics with single project", async () => {
      const singleProject = [mockProjects[0]];

      mockFindMany.mockResolvedValue(singleProject as never);

      const result = await getGraphicsData();

      expect(result.totalProjects).toBe(1);
      expect(result.inProgressProjects).toBe(1);
      expect(result.completedProjects).toBe(0);
      expect(result.projectsByStatus).toHaveLength(1);
      expect(result.projectsByStatus[0]).toEqual({
        status: "in progress",
        count: 1,
        percentage: 100,
      });
    });

    test("should calculate statistics with multiple projects", async () => {
      mockFindMany.mockResolvedValue(mockProjects as never);

      const result = await getGraphicsData();

      expect(result.totalProjects).toBe(4);
      expect(result.completedProjects).toBe(2);
      expect(result.inProgressProjects).toBe(1);
      expect(result.projectsByStatus).toHaveLength(3);
    });

    test("should calculate correct percentages", async () => {
      const testProjects = [mockProjects[1], mockProjects[2], mockProjects[0]];

      mockFindMany.mockResolvedValue(testProjects as never);

      const result = await getGraphicsData();

      const completedStatus = result.projectsByStatus.find(
        (s) => s.status === "completed"
      );
      const inProgressStatus = result.projectsByStatus.find(
        (s) => s.status === "in progress"
      );

      expect(completedStatus?.percentage).toBe(66.67);
      expect(inProgressStatus?.percentage).toBe(33.33);
    });

    test("should handle status case insensitivity", async () => {
      const testProjects = [
        { ...mockProjects[0], status: "In Progress" },
        { ...mockProjects[0], id: 5, status: "IN PROGRESS" },
        { ...mockProjects[1], status: "Completed" },
      ];

      mockFindMany.mockResolvedValue(testProjects as never);

      const result = await getGraphicsData();

      expect(result.inProgressProjects).toBe(2);
      expect(result.completedProjects).toBe(1);

      const inProgressStatus = result.projectsByStatus.find(
        (s) => s.status === "in progress"
      );
      expect(inProgressStatus?.count).toBe(2);
    });

    test("should handle all projects with same status", async () => {
      const completedProjects = [mockProjects[1], mockProjects[2]];

      mockFindMany.mockResolvedValue(completedProjects as never);

      const result = await getGraphicsData();

      expect(result.totalProjects).toBe(2);
      expect(result.completedProjects).toBe(2);
      expect(result.inProgressProjects).toBe(0);
      expect(result.projectsByStatus).toHaveLength(1);
      expect(result.projectsByStatus[0]?.percentage).toBe(100);
    });
  });

  describe("generateAnalysis", () => {
    test("should generate AI analysis for valid project", async () => {
      const mockAIResponse = {
        response: {
          text: () => "This is a comprehensive analysis of the test project.",
        },
      };

      mockFindUnique.mockResolvedValue(mockProjects[0] as never);
      mockGenerateContent.mockResolvedValue(mockAIResponse as never);

      const result = await generateAnalysis(1);

      expect(result.summary).toBe(
        "This is a comprehensive analysis of the test project."
      );
      expect(result.totalProjects).toBe(1);
      expect(result.generatedAt).toBeInstanceOf(Date);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          startDate: true,
          endDate: true,
        },
      });
    });

    test("should throw error when project not found", async () => {
      mockFindUnique.mockResolvedValue(null as never);

      await expect(generateAnalysis(999)).rejects.toThrow(AppError);
      await expect(generateAnalysis(999)).rejects.toThrow("Project not found");

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          startDate: true,
          endDate: true,
        },
      });
    });

    test("should throw error when API key not configured", async () => {
      delete process.env.GEMINI_API_KEY;

      await expect(generateAnalysis(1)).rejects.toThrow(AppError);
      await expect(generateAnalysis(1)).rejects.toThrow(
        "GEMINI_API_KEY not configured in environment variables"
      );
    });

    test("should throw correct AppError properties when not found", async () => {
      mockFindUnique.mockResolvedValue(null as never);

      try {
        await generateAnalysis(999);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).type).toBe("NotFoundError");
      }
    });

    test("should throw correct AppError when missing API key", async () => {
      delete process.env.GEMINI_API_KEY;

      try {
        await generateAnalysis(1);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(500);
        expect((error as AppError).type).toBe("ConfigurationError");
      }
    });

    test("should pass correct prompt to AI model", async () => {
      const mockProject = {
        id: 1,
        name: "Marketing Campaign",
        description: "Q4 marketing campaign for product launch",
        status: "in progress",
        startDate: new Date("2025-01-01"),
        endDate: null,
      };

      const mockAIResponse = {
        response: {
          text: () => "AI analysis result",
        },
      };

      mockFindUnique.mockResolvedValue(mockProject as never);
      mockGenerateContent.mockResolvedValue(mockAIResponse as never);

      await generateAnalysis(1);

      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining("Marketing Campaign")
      );
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining("in progress")
      );
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining("Q4 marketing campaign for product launch")
      );
    });

    test("should use correct AI model", async () => {
      const mockAIResponse = {
        response: {
          text: () => "AI analysis",
        },
      };

      mockFindUnique.mockResolvedValue(mockProjects[1] as never);
      mockGenerateContent.mockResolvedValue(mockAIResponse as never);

      await generateAnalysis(1);

      expect(mockGetGenerativeModel).toHaveBeenCalledWith({
        model: "gemini-2.0-flash",
      });
    });

    test("should handle completed project with endDate", async () => {
      const mockAIResponse = {
        response: {
          text: () =>
            "This project has been successfully completed on schedule.",
        },
      };

      mockFindUnique.mockResolvedValue(mockProjects[2] as never);
      mockGenerateContent.mockResolvedValue(mockAIResponse as never);

      const result = await generateAnalysis(1);

      expect(result.summary).toContain("successfully completed");
      expect(mockFindUnique).toHaveBeenCalled();
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    test("should return current timestamp in generatedAt", async () => {
      const mockAIResponse = {
        response: {
          text: () => "Analysis",
        },
      };

      mockFindUnique.mockResolvedValue(mockProjects[0] as never);
      mockGenerateContent.mockResolvedValue(mockAIResponse as never);

      const beforeCall = new Date();
      const result = await generateAnalysis(1);
      const afterCall = new Date();

      expect(result.generatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCall.getTime()
      );
      expect(result.generatedAt.getTime()).toBeLessThanOrEqual(
        afterCall.getTime()
      );
    });

    test("should handle AI response errors gracefully", async () => {
      mockFindUnique.mockResolvedValue(mockProjects[0] as never);
      mockGenerateContent.mockRejectedValue(
        new Error("AI service unavailable") as never
      );

      await expect(generateAnalysis(1)).rejects.toThrow(
        "AI service unavailable"
      );
    });
  });
});
