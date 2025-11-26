import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProgressScreen from '@/screens/ProgressScreen';
import SessionHistoryScreen from '@/screens/SessionHistoryScreen';
import { getCommonScreenOptions } from '@/navigation/screenOptions';

export type ProgressStackParamList = {
  ProgressHome: undefined;
  SessionHistory: { sessionId: string };
};

const Stack = createNativeStackNavigator<ProgressStackParamList>();

export default function ProgressStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="ProgressHome"
        component={ProgressScreen}
        options={{
          headerTitle: 'Progress',
        }}
      />
      <Stack.Screen
        name="SessionHistory"
        component={SessionHistoryScreen}
        options={{
          headerTitle: 'Session Details',
        }}
      />
    </Stack.Navigator>
  );
}
