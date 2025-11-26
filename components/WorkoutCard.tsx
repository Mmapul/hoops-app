import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { Workout } from '@/types';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  isBookmarked?: boolean;
}

export function WorkoutCard({ workout, onPress, isBookmarked }: WorkoutCardProps) {
  const { theme } = useTheme();

  const getDifficultyColor = () => {
    switch (workout.skillLevel) {
      case 'beginner':
        return theme.success;
      case 'intermediate':
        return theme.warning;
      case 'advanced':
        return theme.error;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.backgroundRoot,
          borderColor: theme.border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.name}>{workout.name}</ThemedText>
          {isBookmarked ? (
            <Feather name="bookmark" size={18} color={theme.primary} />
          ) : null}
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: getDifficultyColor() + '20' },
          ]}
        >
          <ThemedText
            style={[styles.badgeText, { color: getDifficultyColor() }]}
          >
            {workout.skillLevel.toUpperCase()}
          </ThemedText>
        </View>
      </View>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={14} color={theme.tabIconDefault} />
          <ThemedText style={[styles.metaText, { color: theme.tabIconDefault }]}>
            {workout.duration} min
          </ThemedText>
        </View>
        <View style={styles.metaItem}>
          <Feather name="list" size={14} color={theme.tabIconDefault} />
          <ThemedText style={[styles.metaText, { color: theme.tabIconDefault }]}>
            {workout.drills.length} drills
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: 14,
  },
});
