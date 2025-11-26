export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutCategory = 'shooting' | 'dribbling' | 'defense' | 'conditioning';

export interface Drill {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  instructions: string;
}

export interface Workout {
  id: string;
  name: string;
  category: WorkoutCategory;
  skillLevel: SkillLevel;
  duration: number;
  drills: Drill[];
  equipment: string[];
}

export interface CompletedDrill {
  drillId: string;
  drillName: string;
  completed: boolean;
  actualSets?: number;
  actualReps?: number;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  date: number;
  totalTime: number;
  completedDrills: CompletedDrill[];
  notes?: string;
  difficulty?: number;
}

export interface UserProfile {
  displayName: string;
  avatar: 'dunk' | 'shoot' | 'dribble';
  soundEnabled: boolean;
}
