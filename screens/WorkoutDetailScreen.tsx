import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { WORKOUTS } from '@/data/workouts';
import { StorageService } from '@/utils/storage';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import type { WorkoutsStackParamList } from '@/navigation/WorkoutsStackNavigator';
import type { MainTabParamList } from '@/navigation/MainTabNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type WorkoutDetailRouteProp = RouteProp<WorkoutsStackParamList, 'WorkoutDetail'>;
type WorkoutDetailNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<WorkoutsStackParamList, 'WorkoutDetail'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export default function WorkoutDetailScreen() {
  const route = useRoute<WorkoutDetailRouteProp>();
  const navigation = useNavigation<WorkoutDetailNavigationProp>();
  const { theme } = useTheme();
  const { startWorkout } = useWorkout();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedDrills, setExpandedDrills] = useState<Set<string>>(new Set());

  const workout = WORKOUTS.find(w => w.id === route.params.workoutId);

  useEffect(() => {
    loadBookmarkStatus();
  }, []);

  useEffect(() => {
    if (workout) {
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={handleToggleBookmark} style={styles.headerButton}>
            <Feather
              name={isBookmarked ? 'bookmark' : 'bookmark'}
              size={24}
              color={isBookmarked ? theme.primary : theme.text}
              fill={isBookmarked ? theme.primary : 'none'}
            />
          </Pressable>
        ),
      });
    }
  }, [isBookmarked, workout]);

  const loadBookmarkStatus = async () => {
    const bookmarks = await StorageService.getBookmarks();
    setIsBookmarked(bookmarks.includes(route.params.workoutId));
  };

  const handleToggleBookmark = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newStatus = await StorageService.toggleBookmark(route.params.workoutId);
    setIsBookmarked(newStatus);
  };

  const toggleDrill = (drillId: string) => {
    setExpandedDrills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(drillId)) {
        newSet.delete(drillId);
      } else {
        newSet.add(drillId);
      }
      return newSet;
    });
  };

  const handleStartWorkout = () => {
    if (workout) {
      startWorkout(workout);
      navigation.navigate('SessionTab');
    }
  };

  if (!workout) {
    return (
      <View style={styles.container}>
        <ThemedText>Workout not found</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenScrollView>
        <View style={[styles.overviewCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Feather name="clock" size={20} color={theme.primary} />
              <ThemedText style={styles.statLabel}>Duration</ThemedText>
              <ThemedText style={styles.statValue}>{workout.duration} min</ThemedText>
            </View>
            <View style={styles.stat}>
              <Feather name="list" size={20} color={theme.primary} />
              <ThemedText style={styles.statLabel}>Drills</ThemedText>
              <ThemedText style={styles.statValue}>{workout.drills.length}</ThemedText>
            </View>
            <View style={styles.stat}>
              <Feather name="tool" size={20} color={theme.primary} />
              <ThemedText style={styles.statLabel}>Equipment</ThemedText>
              <ThemedText style={styles.statValue}>{workout.equipment.length}</ThemedText>
            </View>
          </View>
          {workout.equipment.length > 0 ? (
            <View style={styles.equipmentSection}>
              <ThemedText style={styles.equipmentTitle}>Equipment Needed:</ThemedText>
              <ThemedText style={[styles.equipmentList, { color: theme.tabIconDefault }]}>
                {workout.equipment.join(', ')}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText style={styles.drillsTitle}>Drills</ThemedText>

        {workout.drills.map((drill, index) => (
          <Pressable
            key={drill.id}
            onPress={() => toggleDrill(drill.id)}
            style={[styles.drillCard, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}
          >
            <View style={styles.drillHeader}>
              <View style={styles.drillNumber}>
                <ThemedText style={[styles.drillNumberText, { color: theme.primary }]}>
                  {index + 1}
                </ThemedText>
              </View>
              <ThemedText style={styles.drillName}>{drill.name}</ThemedText>
              <Feather
                name={expandedDrills.has(drill.id) ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.tabIconDefault}
              />
            </View>
            <View style={styles.drillMeta}>
              <ThemedText style={[styles.drillMetaText, { color: theme.tabIconDefault }]}>
                {drill.sets} sets × {drill.reps} reps • {drill.restSeconds}s rest
              </ThemedText>
            </View>
            {expandedDrills.has(drill.id) ? (
              <View style={styles.drillInstructions}>
                <ThemedText style={[styles.instructionsText, { color: theme.tabIconDefault }]}>
                  {drill.instructions}
                </ThemedText>
              </View>
            ) : null}
          </Pressable>
        ))}
      </ScreenScrollView>

      <View style={[styles.bottomButton, { backgroundColor: theme.backgroundRoot, borderTopColor: theme.border }]}>
        <Button onPress={handleStartWorkout}>Start Workout</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  overviewCard: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  stat: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  equipmentSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: Spacing.md,
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  equipmentList: {
    fontSize: 14,
  },
  drillsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  drillCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  drillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  drillNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 107, 44, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drillNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  drillName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  drillMeta: {
    marginLeft: 40,
  },
  drillMetaText: {
    fontSize: 13,
  },
  drillInstructions: {
    marginTop: Spacing.md,
    marginLeft: 40,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomButton: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
});
