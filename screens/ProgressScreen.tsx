import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { StorageService } from '@/utils/storage';
import { WorkoutSession } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import type { ProgressStackParamList } from '@/navigation/ProgressStackNavigator';

type NavigationProp = NativeStackNavigationProp<ProgressStackParamList, 'ProgressHome'>;

export default function ProgressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSessions();
    });
    loadSessions();
    return unsubscribe;
  }, [navigation]);

  const loadSessions = async () => {
    const data = await StorageService.getSessions();
    setSessions(data);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const totalWorkouts = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.totalTime, 0);
  const totalMinutesFormatted = Math.floor(totalMinutes / 60);

  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedDates = [...new Set(sessions.map(s => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }))].sort((a, b) => b - a);

    let expectedDate = today.getTime();
    
    for (const sessionDate of sortedDates) {
      if (sessionDate === expectedDate || sessionDate === expectedDate - 86400000) {
        streak++;
        expectedDate = sessionDate - 86400000;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  const groupedSessions = sessions.reduce((groups, session) => {
    const date = formatDate(session.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, WorkoutSession[]>);

  return (
    <ScreenScrollView>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="check-circle" size={24} color={theme.primary} />
          <ThemedText style={styles.statValue}>{totalWorkouts}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
            Total Workouts
          </ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="zap" size={24} color={theme.warning} />
          <ThemedText style={styles.statValue}>{streak}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
            Day Streak
          </ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="clock" size={24} color={theme.success} />
          <ThemedText style={styles.statValue}>{totalMinutesFormatted}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
            Total Minutes
          </ThemedText>
        </View>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="bar-chart-2" size={64} color={theme.tabIconDefault} />
          <ThemedText style={styles.emptyTitle}>No Workouts Yet</ThemedText>
          <ThemedText style={[styles.emptyText, { color: theme.tabIconDefault }]}>
            Complete your first workout to start tracking your progress.
          </ThemedText>
        </View>
      ) : (
        <>
          <ThemedText style={styles.sectionTitle}>Recent Sessions</ThemedText>
          
          {Object.entries(groupedSessions).map(([date, dateSessions]) => (
            <View key={date}>
              <ThemedText style={[styles.dateHeader, { color: theme.tabIconDefault }]}>
                {date}
              </ThemedText>
              {dateSessions.map((session) => (
                <Pressable
                  key={session.id}
                  onPress={() => navigation.navigate('SessionHistory', { sessionId: session.id })}
                  style={[
                    styles.sessionCard,
                    { backgroundColor: theme.backgroundRoot, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.sessionHeader}>
                    <ThemedText style={styles.sessionName}>{session.workoutName}</ThemedText>
                    <Feather name="chevron-right" size={20} color={theme.tabIconDefault} />
                  </View>
                  <View style={styles.sessionMeta}>
                    <View style={styles.metaItem}>
                      <Feather name="clock" size={14} color={theme.tabIconDefault} />
                      <ThemedText style={[styles.metaText, { color: theme.tabIconDefault }]}>
                        {formatTime(session.totalTime)}
                      </ThemedText>
                    </View>
                    <View style={styles.metaItem}>
                      <Feather name="check" size={14} color={theme.success} />
                      <ThemedText style={[styles.metaText, { color: theme.tabIconDefault }]}>
                        {session.completedDrills.filter(d => d.completed).length}/{session.completedDrills.length} drills
                      </ThemedText>
                    </View>
                    {session.difficulty ? (
                      <View style={styles.metaItem}>
                        <Feather name="star" size={14} color={theme.warning} fill={theme.warning} />
                        <ThemedText style={[styles.metaText, { color: theme.tabIconDefault }]}>
                          {session.difficulty}/5
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </>
      )}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  sessionCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: 13,
  },
});
