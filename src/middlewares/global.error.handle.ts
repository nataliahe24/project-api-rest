import type { NextFunction } from "express";
import type { Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(Number(err.statusCode) || 500).json({
    ok: false,
    type: err.type || "UnhandledError",
    message: err.message || "Internal Server Error",
  });
};
