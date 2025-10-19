import { jest } from "@jest/globals";

export const mockPrismaClient = {
  project: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export class PrismaClient {
  project = mockPrismaClient.project;
}
