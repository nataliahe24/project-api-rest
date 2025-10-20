export const VALID_PROJECT_STATUSES = ["in progress", "completed"] as const;
export type ProjectStatus = (typeof VALID_PROJECT_STATUSES)[number];

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
}
