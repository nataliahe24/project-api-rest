import { describe, expect, test } from "@jest/globals";
import { AppError } from "../src/utils/app.error.js";

describe("AppError", () => {
  test("should create an error with default values", () => {
    const error = new AppError("Something went wrong");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(400);
    expect(error.type).toBe("AppError");
  });

  test("should create an error with custom statusCode", () => {
    const error = new AppError("Not found", 404);

    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
    expect(error.type).toBe("AppError");
  });

  test("should create an error with custom type", () => {
    const error = new AppError("Validation failed", 400, "ValidationError");

    expect(error.message).toBe("Validation failed");
    expect(error.statusCode).toBe(400);
    expect(error.type).toBe("ValidationError");
  });

  test("should create a 404 NotFoundError", () => {
    const error = new AppError("Project not found", 404, "NotFoundError");

    expect(error.message).toBe("Project not found");
    expect(error.statusCode).toBe(404);
    expect(error.type).toBe("NotFoundError");
  });

  test("should create a 400 ValidationError", () => {
    const error = new AppError(
      "End date is required when status is Completed",
      400,
      "ValidationError"
    );

    expect(error.message).toBe("End date is required when status is Completed");
    expect(error.statusCode).toBe(400);
    expect(error.type).toBe("ValidationError");
  });

  test("should have Error properties (name, stack)", () => {
    const error = new AppError("Test error");

    expect(error.name).toBe("Error");
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
  });

  test("should be throwable", () => {
    expect(() => {
      throw new AppError("Test throw");
    }).toThrow(AppError);

    expect(() => {
      throw new AppError("Test throw");
    }).toThrow("Test throw");
  });

  test("should be catchable as AppError", () => {
    try {
      throw new AppError("Catchable error", 500, "ServerError");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      if (error instanceof AppError) {
        expect(error.statusCode).toBe(500);
        expect(error.type).toBe("ServerError");
      }
    }
  });
});
