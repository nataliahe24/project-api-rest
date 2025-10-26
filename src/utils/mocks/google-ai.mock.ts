import { jest } from "@jest/globals";

export const mockGenerateContent = jest.fn();

export const mockGetGenerativeModel = jest.fn(
  (_config?: { model: string }) => ({
    generateContent: mockGenerateContent,
  })
);

export const mockGoogleGenerativeAI = jest.fn().mockImplementation(() => ({
  getGenerativeModel: mockGetGenerativeModel,
}));
