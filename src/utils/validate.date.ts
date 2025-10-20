import type { ProjectStatus } from "../interfaces/project.interface.js";
import { AppError } from "./app.error.js";

export const DateIsRequired = (
  status: ProjectStatus,
  date?: string
): Date | null => {
  const endDateValue = date ? new Date(date) : null;
  const hasEndDate = endDateValue !== null && endDateValue !== undefined;

  if (status === "completed" && !hasEndDate) {
    throw new AppError(
      "End date is required when status is " + status,
      400,
      "ValidationError"
    );
  }

  if (status === "in progress" && hasEndDate) {
    throw new AppError(
      "End date is not allowed when status is " + status,
      400,
      "ValidationError"
    );
  }
  return endDateValue;
};
