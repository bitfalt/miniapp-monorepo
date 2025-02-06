export interface Question {
  id: number;
  question: string;
  effect: {
    econ: number;
    dipl: number;
    govt: number;
    scty: number;
  };
}

export interface TestResult {
  econ: number;
  dipl: number;
  govt: number;
  scty: number;
}

export interface TestProgress {
  testId: number;
  testName: string;
  description: string;
  totalQuestions: number;
  answeredQuestions: number;
  status: "not_started" | "in_progress" | "completed";
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}
