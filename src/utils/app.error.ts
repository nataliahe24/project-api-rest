export class AppError extends Error {
  statusCode: number;
  type: string;

  constructor(message: string, statusCode = 400, type = "AppError") {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}
