import { describe, expect, test } from "@jest/globals";
import { DateIsRequired } from "../validate.date.js";
import { AppError } from "../app.error.js";

describe("DateIsRequired", () => {
  describe('when status is "completed"', () => {
    test("should return Date object when endDate is provided", () => {
      const dateString = "2025-12-31";
      const result = DateIsRequired("completed", dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toContain("2025-12-31");
    });

    test("should throw AppError when endDate is not provided", () => {
      expect(() => {
        DateIsRequired("completed", undefined);
      }).toThrow(AppError);

      expect(() => {
        DateIsRequired("completed", undefined);
      }).toThrow("End date is required when status is Completed");
    });

    test("should throw AppError with statusCode 400", () => {
      try {
        DateIsRequired("completed", undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(400);
        expect((error as AppError).type).toBe("ValidationError");
      }
    });

    test("should throw AppError when endDate is empty string", () => {
      expect(() => {
        DateIsRequired("completed", "");
      }).toThrow("End date is required when status is Completed");
    });
  });

  describe('when status is "in progress"', () => {
    test("should return null when endDate is not provided", () => {
      const result = DateIsRequired("in progress", undefined);

      expect(result).toBeNull();
    });

    test("should return null when endDate is empty string", () => {
      const result = DateIsRequired("in progress", "");

      expect(result).toBeNull();
    });

    test("should throw AppError when endDate is provided", () => {
      expect(() => {
        DateIsRequired("in progress", "2025-12-31");
      }).toThrow(AppError);

      expect(() => {
        DateIsRequired("in progress", "2025-12-31");
      }).toThrow("End date is not allowed when status is In Progress");
    });

    test("should throw AppError with statusCode 400 when endDate is provided", () => {
      try {
        DateIsRequired("in progress", "2025-12-31");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(400);
        expect((error as AppError).type).toBe("ValidationError");
      }
    });
  });

  describe("edge cases", () => {
    test("should handle valid ISO date string", () => {
      const dateString = "2025-10-19T04:05:25.676Z";
      const result = DateIsRequired("completed", dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2025);
      expect(result?.getMonth()).toBe(9);
    });

    test("should handle Date object toString()", () => {
      const date = new Date("2025-12-31");
      const result = DateIsRequired("completed", date.toISOString());

      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toContain("2025-12-31");
    });

    test('should return null for "in progress" without throwing', () => {
      expect(() => DateIsRequired("in progress", undefined)).not.toThrow();
      expect(() => DateIsRequired("in progress", "")).not.toThrow();
    });
  });
});
