export interface QuizQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'image-select';
  answer: string | string[];
  options?: string[];
  imageUrl?: string;
  hints?: string[]; // Array of hints that can be purchased one by one
  people?: Array<{
    id: string;
    name: string;
    image: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  correctPersonId?: string;
}

export interface ImageArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageChallenge {
  id: string;
  imageUrl: string;
  prompt: string;
  areas: ImageArea[];
  correctAreas: string[];
}

export interface GroupState {
  groupId: string;
  quizCompleted: boolean;
  imageSelectCompleted: boolean;
}

export type FlowStep = 'recaptcha' | 'group-select' | 'quiz' | 'image-select' | 'success';
