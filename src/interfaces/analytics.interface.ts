export interface ProjectsByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface GraphicsData {
  totalProjects: number;
  projectsByStatus: ProjectsByStatus[];
  completedProjects: number;
  inProgressProjects: number;
}

export interface AnalysisResponse {
  summary: string;
  totalProjects: number;
  generatedAt: Date;
}
