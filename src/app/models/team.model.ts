export interface Team {
  id: number;
  name: string;
  created_at: string;
  members_count?: number; // סימן שאלה כי לפעמים השרת מחזיר את זה ולפעמים לא (תלוי באנדפוינט)
}

export interface CreateTeamRequest {
  name: string;
}

export interface AddMemberRequest {
  userId: number;
  role: 'member' | 'admin'; // הגבלנו את הערכים האפשריים כדי למנוע טעויות
}