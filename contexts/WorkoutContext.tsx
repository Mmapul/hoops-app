import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Workout, CompletedDrill } from '@/types';

interface WorkoutContextType {
  activeWorkout: Workout | null;
  startWorkout: (workout: Workout) => void;
  endWorkout: () => void;
  currentDrillIndex: number;
  setCurrentDrillIndex: (index: number) => void;
  completedDrills: CompletedDrill[];
  markDrillComplete: (drillId: string, completed: boolean) => void;
  sessionStartTime: number | null;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [completedDrills, setCompletedDrills] = useState<CompletedDrill[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setCurrentDrillIndex(0);
    setSessionStartTime(Date.now());
    setCompletedDrills(
      workout.drills.map(drill => ({
        drillId: drill.id,
        drillName: drill.name,
        completed: false,
      }))
    );
  };

  const endWorkout = () => {
    setActiveWorkout(null);
    setCurrentDrillIndex(0);
    setCompletedDrills([]);
    setSessionStartTime(null);
  };

  const markDrillComplete = (drillId: string, completed: boolean) => {
    setCompletedDrills(prev =>
      prev.map(drill =>
        drill.drillId === drillId ? { ...drill, completed } : drill
      )
    );
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        startWorkout,
        endWorkout,
        currentDrillIndex,
        setCurrentDrillIndex,
        completedDrills,
        markDrillComplete,
        sessionStartTime,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
