import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { StorageService } from '@/utils/storage';
import { WorkoutSession } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import type { ProgressStackParamList } from '@/navigation/ProgressStackNavigator';

type SessionHistoryRouteProp = RouteProp<ProgressStackParamList, 'SessionHistory'>;

export default function SessionHistoryScreen() {
  const route = useRoute<SessionHistoryRouteProp>();
  const { theme } = useTheme();
  const [session, setSession] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const sessions = await StorageService.getSessions();
    const found = sessions.find(s => s.id === route.params.sessionId);
    if (found) {
      setSession(found);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <ThemedText>Session not found</ThemedText>
      </View>
    );
  }

  const completedCount = session.completedDrills.filter(d => d.completed).length;

  return (
    <ScreenScrollView>
      <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText style={styles.date}>{formatDate(session.date)}</ThemedText>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Feather name="clock" size={20} color={theme.primary} />
            <ThemedText style={styles.statLabel}>Duration</ThemedText>
            <ThemedText style={styles.statValue}>{formatTime(session.totalTime)}</ThemedText>
          </View>
          
          <View style={styles.stat}>
            <Feather name="check-circle" size={20} color={theme.success} />
            <ThemedText style={styles.statLabel}>Completed</ThemedText>
            <ThemedText style={styles.statValue}>{completedCount}/{session.completedDrills.length}</ThemedText>
          </View>
          
          {session.difficulty ? (
            <View style={styles.stat}>
              <Feather name="star" size={20} color={theme.warning} fill={theme.warning} />
              <ThemedText style={styles.statLabel}>Difficulty</ThemedText>
              <ThemedText style={styles.statValue}>{session.difficulty}/5</ThemedText>
            </View>
          ) : null}
        </View>
      </View>

      <ThemedText style={styles.sectionTitle}>Drills</ThemedText>

      {session.completedDrills.map((drill, index) => (
        <View
          key={drill.drillId}
          style={[
            styles.drillCard,
            { backgroundColor: theme.backgroundRoot, borderColor: theme.border },
          ]}
        >
          <View style={styles.drillRow}>
            <Feather
              name={drill.completed ? 'check-circle' : 'circle'}
              size={24}
              color={drill.completed ? theme.success : theme.tabIconDefault}
            />
            <ThemedText style={styles.drillName}>{drill.drillName}</ThemedText>
          </View>
        </View>
      ))}

      {session.notes ? (
        <>
          <ThemedText style={styles.sectionTitle}>Notes</ThemedText>
          <View style={[styles.notesCard, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={[styles.notesText, { color: theme.tabIconDefault }]}>
              {session.notes}
            </ThemedText>
          </View>
        </>
      ) : null}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  summaryCard: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  sectionTitle: {
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
  drillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  drillName: {
    fontSize: 16,
    flex: 1,
  },
  notesCard: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  notesText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
