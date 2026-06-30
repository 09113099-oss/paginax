export interface Question {
  number: number;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  question: string;
  answer: string;
  format: string;
  points: number;
  penalty: number;
  help?: string | null;
}

export interface SetupData {
  theme: string;
  audience: string;
  level: string;
  mandatory: string;
}
