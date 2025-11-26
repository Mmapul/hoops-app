import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutsScreen from '@/screens/WorkoutsScreen';
import WorkoutDetailScreen from '@/screens/WorkoutDetailScreen';
import { getCommonScreenOptions } from '@/navigation/screenOptions';
import { HeaderTitle } from '@/components/HeaderTitle';

export type WorkoutsStackParamList = {
  Workouts: undefined;
  WorkoutDetail: { workoutId: string };
};

const Stack = createNativeStackNavigator<WorkoutsStackParamList>();

export default function WorkoutsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Basketball Workout" />,
        }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{
          headerTitle: 'Workout Details',
        }}
      />
    </Stack.Navigator>
  );
}
