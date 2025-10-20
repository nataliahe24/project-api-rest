import { PrismaClient } from "../../generated/prisma/client.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  GraphicsData,
  AnalysisResponse,
} from "../interfaces/analytics.interface.js";
import { AppError } from "../utils/app.error.js";

const prisma = new PrismaClient();

export const getGraphicsData = async (): Promise<GraphicsData> => {
  const projects = await prisma.project.findMany();
  const totalProjects = projects.length;

  if (totalProjects === 0) {
    return {
      totalProjects: 0,
      projectsByStatus: [],
      completedProjects: 0,
      inProgressProjects: 0,
    };
  }

  const statusCounts = projects.reduce((acc, project) => {
    const status = project.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const projectsByStatus = Object.entries(statusCounts).map(
    ([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / totalProjects) * 100 * 100) / 100,
    })
  );

  const completedProjects = statusCounts["completed"] || 0;
  const inProgressProjects = statusCounts["in progress"] || 0;

  return {
    totalProjects,
    projectsByStatus,
    completedProjects,
    inProgressProjects,
  };
};

export const generateAnalysis = async (
  projectId: number
): Promise<AnalysisResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new AppError(
      "GEMINI_API_KEY not configured in environment variables",
      500,
      "ConfigurationError"
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!project) {
    console.error("❌ Proyecto no encontrado:", projectId);
    throw new AppError("Project not found", 404, "NotFoundError");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Analyze the following project description and generate 
a brief professional executive summary (maximum 100 words) that includes:
- Analysis of project scope and objectives
- Key points and notable elements
- Current status evaluation
- Observations and recommendations if applicable

Project: ${project.name}
Status: ${project.status}
Description: ${project.description}

Provide a concise and professional summary only one paragraph in English.`;

  const result = await model.generateContent(prompt);
  const summary = result.response.text();

  return {
    summary,
    totalProjects: 1,
    generatedAt: new Date(),
  };
};
