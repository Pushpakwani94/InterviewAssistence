export interface Question {
  _id?: string;
  question: string;
  answer: string;
  explanation?: string;
  example?: string;
  keywords: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  technology: string;
  category: any;
}

export interface Session {
  _id?: string;
  sessionName: string;
  candidateName: string;
  technology: string;
  startTime: Date;
  endTime: Date;
  sessionCode: string;
  isActive: boolean;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Candidate';
  token?: string;
}
