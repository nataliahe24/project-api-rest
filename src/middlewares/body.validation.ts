import { body, type CustomValidator } from "express-validator";
import { VALID_PROJECT_STATUSES } from "../interfaces/project.interface.js";

const isValidStatus: CustomValidator = (value) => {
  const normalizedValue = String(value).toLowerCase();
  if (
    !VALID_PROJECT_STATUSES.includes(
      normalizedValue as (typeof VALID_PROJECT_STATUSES)[number]
    )
  ) {
    throw new Error("Invalid status");
  }
  return true;
};

const validateEndDate: CustomValidator = (value) => {
  if (value && isNaN(Date.parse(value))) {
    throw new Error("Invalid end date format");
  }
  return true;
};

export const createProjectValidation = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),

  body("description")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("status").isString().custom(isValidStatus),

  body("startDate")
    .isISO8601()
    .withMessage("Invalid start date format")
    .toDate(),

  body("endDate").optional({ values: "null" }).custom(validateEndDate),
];

export const updateProjectValidation = [
  body("name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("description")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("status").optional().isString().custom(isValidStatus),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format")
    .toDate(),

  body("endDate").optional({ values: "null" }).custom(validateEndDate),
];
