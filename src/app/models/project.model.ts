export interface Project {
  id: number;
  team_id: number; // השרת מחזיר ב-snake_case
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed'; // ניחוש מושכל של סטטוסים אפשריים
  created_at: string;
}

export interface CreateProjectRequest {
  teamId: number; // אנחנו שולחים ב-camelCase
  name: string;
  description: string;
}