

export enum PersonalityType {
  Extrovert = 'EXTROVERT',
  Introvert = 'INTROVERT',
  Ambivert = 'AMBIVERT'
}

export enum AppMode {
  Teacher = 'TEACHER',
  Student = 'STUDENT',
  Kahoot = 'KAHOOT',
  Exam = 'EXAM',
  MiniGames = 'MINIGAMES',
  Vocabulary = 'VOCABULARY',
  Testing = 'TESTING'
}

export enum DeviceView {
  Mobile = 'MOBILE',
  Tablet = 'TABLET',
  Desktop = 'DESKTOP',
  SmartBoard = 'SMARTBOARD'
}

export interface Phrase {
  id: string;
  text: string;
  category: 'green' | 'yellow' | 'red';
  ccq: string[];
  definition: string;
}

export interface LessonStage {
  id: string;
  title: string;
  duration: number; // minutes
  type: 'lead-in' | 'vocabulary' | 'grammar' | 'task' | 'feedback';
  content: {
    description: string;
    instructions: string;
    icqs: string[];
    boardContent?: any;
  };
}

export interface Badge {
  id: string;
  icon: string; // Emoji or Icon name
  name: string;
  description: string;
  unlocked: boolean;
}

export interface PlayerStats {
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
}

// --- Arcade Types ---

export type GameType = 'KAHOOT';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[]; // Always 4 options
  correctIndex: number;
  timeLimit: number; // Seconds
  isDoublePoints: boolean;
  image?: string; // Optional context image
}

export interface GameLevel {
  id: string;
  number: number;
  title: string;
  type: GameType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE';
  description: string;
  data: {
    questions: QuizQuestion[];
  }; 
  xpReward: number;
}