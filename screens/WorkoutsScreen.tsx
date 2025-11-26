import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { WorkoutCard } from '@/components/WorkoutCard';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { WORKOUTS } from '@/data/workouts';
import { StorageService } from '@/utils/storage';
import { SkillLevel, WorkoutCategory } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import type { WorkoutsStackParamList } from '@/navigation/WorkoutsStackNavigator';

type NavigationProp = NativeStackNavigationProp<WorkoutsStackParamList, 'Workouts'>;

export default function WorkoutsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const saved = await StorageService.getBookmarks();
    setBookmarks(saved);
  };

  const skillLevels: Array<{ key: SkillLevel | 'all'; label: string }> = [
    { key: 'all', label: 'All Levels' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
  ];

  const filteredWorkouts = WORKOUTS.filter(w =>
    selectedLevel === 'all' || w.skillLevel === selectedLevel
  );

  const categories: Array<{ key: WorkoutCategory; label: string; icon: keyof typeof Feather.glyphMap }> = [
    { key: 'shooting', label: 'Shooting', icon: 'target' },
    { key: 'dribbling', label: 'Dribbling', icon: 'circle' },
    { key: 'defense', label: 'Defense', icon: 'shield' },
    { key: 'conditioning', label: 'Conditioning', icon: 'activity' },
  ];

  const handleStartWorkout = () => {
    if (filteredWorkouts.length > 0) {
      navigation.navigate('WorkoutDetail', { workoutId: filteredWorkouts[0].id });
    }
  };

  return (
    <View style={styles.container}>
      <ScreenScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.levelScroll}
          contentContainerStyle={styles.levelContent}
        >
          {skillLevels.map((level) => (
            <Pressable
              key={level.key}
              onPress={() => setSelectedLevel(level.key)}
              style={[
                styles.levelPill,
                {
                  backgroundColor: selectedLevel === level.key ? theme.primary : theme.backgroundDefault,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.levelText,
                  {
                    color: selectedLevel === level.key ? '#FFFFFF' : theme.text,
                  },
                ]}
              >
                {level.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {categories.map((category) => {
          const categoryWorkouts = filteredWorkouts.filter(w => w.category === category.key);
          if (categoryWorkouts.length === 0) return null;

          return (
            <View key={category.key} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name={category.icon} size={20} color={theme.primary} />
                <ThemedText style={styles.sectionTitle}>{category.label}</ThemedText>
              </View>
              {categoryWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onPress={() => navigation.navigate('WorkoutDetail', { workoutId: workout.id })}
                  isBookmarked={bookmarks.includes(workout.id)}
                />
              ))}
            </View>
          );
        })}
      </ScreenScrollView>
      <FloatingActionButton onPress={handleStartWorkout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  levelScroll: {
    marginBottom: Spacing.lg,
  },
  levelContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  levelPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
});
