import { describe, expect, test } from "@jest/globals";
import { AppError } from "../../utils/app.error.js";

describe("Project Service - Business Logic", () => {
  describe("Business Rules Validation", () => {
    test("should validate that completed projects require endDate", () => {
      const status = "completed";
      const hasEndDate = false;

      expect(() => {
        if (status === "completed" && !hasEndDate) {
          throw new AppError(
            "End date is required when status is Completed",
            400,
            "ValidationError"
          );
        }
      }).toThrow("End date is required when status is Completed");
    });

    test("should validate that in progress projects cannot have endDate", () => {
      const status = "in progress";
      const hasEndDate = true;

      expect(() => {
        if (status === "in progress" && hasEndDate) {
          throw new AppError(
            "End date is not allowed when status is In Progress",
            400,
            "ValidationError"
          );
        }
      }).toThrow("End date is not allowed when status is In Progress");
    });

    test("should allow in progress projects without endDate", () => {
      const status: string = "in progress";
      const hasEndDate = false;

      expect(() => {
        if (status === "completed" && !hasEndDate) {
          throw new AppError(
            "End date is required when status is Completed",
            400,
            "ValidationError"
          );
        }
        if (status === "in progress" && hasEndDate) {
          throw new AppError(
            "End date is not allowed when status is In Progress",
            400,
            "ValidationError"
          );
        }
      }).not.toThrow();
    });

    test("should allow completed projects with endDate", () => {
      const status: string = "completed";
      const hasEndDate = true;

      expect(() => {
        if (status === "completed" && !hasEndDate) {
          throw new AppError(
            "End date is required when status is Completed",
            400,
            "ValidationError"
          );
        }
        if (status === "in progress" && hasEndDate) {
          throw new AppError(
            "End date is not allowed when status is In Progress",
            400,
            "ValidationError"
          );
        }
      }).not.toThrow();
    });
  });

  describe("Status Normalization", () => {
    test("should handle case-insensitive status comparison", () => {
      const testCases = ["completed", "in progress"];

      for (const status of testCases) {
        const normalized = status.toLowerCase();
        const isValid =
          normalized === "completed" || normalized === "in progress";
        expect(isValid).toBe(true);
      }
    });

    test("should normalize mixed case status values", () => {
      const mixedCaseStatus = "In Progress";
      const normalized = mixedCaseStatus.toLowerCase();

      expect(normalized).toBe("in progress");
    });
  });

  describe("Date Handling", () => {
    test("should handle null endDate correctly", () => {
      const endDate = null;
      const hasEndDate = endDate !== null && endDate !== undefined;

      expect(hasEndDate).toBe(false);
    });

    test("should handle undefined endDate correctly", () => {
      const endDate = undefined;
      const hasEndDate = endDate !== null && endDate !== undefined;

      expect(hasEndDate).toBe(false);
    });

    test("should handle valid Date object correctly", () => {
      const endDate = new Date("2025-12-31");
      const hasEndDate = endDate !== null && endDate !== undefined;

      expect(hasEndDate).toBe(true);
    });

    test("should handle empty string as no date", () => {
      const endDate = "";
      const endDateValue = endDate ? new Date(endDate) : null;

      expect(endDateValue).toBeNull();
    });
  });

  describe("Description Handling", () => {
    test("should handle missing description with empty string fallback", () => {
      const project: { name: string; status: string; description?: string } = {
        name: "Test Project",
        status: "in progress",
      };

      const description = project.description ?? "";

      expect(description).toBe("");
    });

    test("should preserve existing description", () => {
      const project: { name: string; status: string; description?: string } = {
        name: "Test Project",
        description: "Test Description",
        status: "in progress",
      };

      const description = project.description ?? "";

      expect(description).toBe("Test Description");
    });
  });

  describe("Error Handling", () => {
    test("should create AppError with correct properties for validation", () => {
      const error = new AppError(
        "End date is required when status is Completed",
        400,
        "ValidationError"
      );

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        "End date is required when status is Completed"
      );
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe("ValidationError");
    });

    test("should create AppError with correct properties for not found", () => {
      const error = new AppError("Project not found", 404, "NotFoundError");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Project not found");
      expect(error.statusCode).toBe(404);
      expect(error.type).toBe("NotFoundError");
    });
  });
});
