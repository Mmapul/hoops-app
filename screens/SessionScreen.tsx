import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Modal, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { ScreenKeyboardAwareScrollView } from '@/components/ScreenKeyboardAwareScrollView';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useWorkout } from '@/contexts/WorkoutContext';
import { StorageService } from '@/utils/storage';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function SessionScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    activeWorkout,
    currentDrillIndex,
    setCurrentDrillIndex,
    completedDrills,
    markDrillComplete,
    sessionStartTime,
    endWorkout,
  } = useWorkout();

  const [sessionTime, setSessionTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState(3);

  useEffect(() => {
    if (sessionStartTime && activeWorkout) {
      const interval = setInterval(() => {
        setSessionTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sessionStartTime, activeWorkout]);

  useEffect(() => {
    if (isResting && restTime > 0) {
      const interval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsResting(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isResting, restTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDrill = activeWorkout?.drills[currentDrillIndex];
  const completedCount = completedDrills.filter(d => d.completed).length;
  const [showVideo, setShowVideo] = useState(false);

  const handleNext = () => {
    if (!activeWorkout) return;
    
    if (currentDrillIndex < activeWorkout.drills.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentDrillIndex(currentDrillIndex + 1);
      setIsResting(false);
      setRestTime(0);
    }
  };

  const handlePrevious = () => {
    if (currentDrillIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentDrillIndex(currentDrillIndex - 1);
      setIsResting(false);
      setRestTime(0);
    }
  };

  const handleToggleComplete = () => {
    if (currentDrill) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const isCompleted = completedDrills.find(d => d.drillId === currentDrill.id)?.completed || false;
      markDrillComplete(currentDrill.id, !isCompleted);
    }
  };

  const handleStartRest = () => {
    if (currentDrill) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setRestTime(currentDrill.restSeconds);
      setIsResting(true);
    }
  };

  const handleEndSession = () => {
    Alert.alert(
      'End Session?',
      'Do you want to save this workout session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => endWorkout() },
        { text: 'Save', onPress: () => setShowCompleteModal(true) },
      ]
    );
  };

  const handleSaveSession = async () => {
    if (!activeWorkout || !sessionStartTime) return;

    await StorageService.saveSession({
      id: Date.now().toString(),
      workoutId: activeWorkout.id,
      workoutName: activeWorkout.name,
      date: sessionStartTime,
      totalTime: sessionTime,
      completedDrills,
      notes,
      difficulty,
    });

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowCompleteModal(false);
    endWorkout();
    setNotes('');
    setDifficulty(3);
  };

  if (!activeWorkout || !currentDrill) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top + Spacing.xl, paddingBottom: tabBarHeight + Spacing.xl }]}>
        <Feather name="play-circle" size={64} color={theme.tabIconDefault} />
        <ThemedText style={styles.emptyTitle}>No Active Session</ThemedText>
        <ThemedText style={[styles.emptyText, { color: theme.tabIconDefault }]}>
          Start a workout from the Workouts tab to begin your training session.
        </ThemedText>
      </View>
    );
  }

  const isCurrentDrillComplete = completedDrills.find(d => d.drillId === currentDrill.id)?.completed || false;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, backgroundColor: theme.backgroundDefault }]}>
        <Pressable onPress={handleEndSession} style={styles.headerButton}>
          <Feather name="x" size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.sessionTimer}>{formatTime(sessionTime)}</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <View style={[styles.content, { paddingBottom: tabBarHeight + Spacing.xl }]}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(completedCount / activeWorkout.drills.length) * 100}%`, backgroundColor: theme.primary }]} />
        </View>
        <ThemedText style={[styles.progressText, { color: theme.tabIconDefault }]}>
          {completedCount} of {activeWorkout.drills.length} drills completed
        </ThemedText>

        <ThemedText style={styles.drillName}>{currentDrill.name}</ThemedText>

        <View style={styles.centerStats}>
          <View style={styles.statBox}>
            <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>Sets</ThemedText>
            <ThemedText style={styles.statBig}>{currentDrill.sets}</ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>Reps</ThemedText>
            <ThemedText style={styles.statBig}>{currentDrill.reps}</ThemedText>
          </View>
        </View>

        {isResting ? (
          <View style={styles.restContainer}>
            <ThemedText style={[styles.restLabel, { color: theme.tabIconDefault }]}>Rest</ThemedText>
            <ThemedText style={[styles.restTimer, { color: theme.primary }]}>{formatTime(restTime)}</ThemedText>
          </View>
        ) : (
          <Pressable
            onPress={handleStartRest}
            style={[styles.restButton, { borderColor: theme.border }]}
          >
            <Feather name="coffee" size={20} color={theme.tabIconDefault} />
            <ThemedText style={[styles.restButtonText, { color: theme.tabIconDefault }]}>
              Start {currentDrill.restSeconds}s Rest
            </ThemedText>
          </Pressable>
        )}

        <View style={styles.instructions}>
          <ThemedText style={[styles.instructionsText, { color: theme.tabIconDefault }]}>
            {currentDrill.instructions}
          </ThemedText>
        </View>

        <VideoPlayer videoUrl={currentDrill.videoUrl} drillName={currentDrill.name} />

        <View style={styles.controls}>
          <Pressable
            onPress={handlePrevious}
            disabled={currentDrillIndex === 0}
            style={[
              styles.navButton,
              { backgroundColor: theme.backgroundDefault, opacity: currentDrillIndex === 0 ? 0.3 : 1 },
            ]}
          >
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>

          <Pressable
            onPress={handleToggleComplete}
            style={[
              styles.completeButton,
              { backgroundColor: isCurrentDrillComplete ? theme.success : theme.backgroundDefault },
            ]}
          >
            <Feather name="check" size={24} color={isCurrentDrillComplete ? '#FFFFFF' : theme.text} />
            <ThemedText style={{ color: isCurrentDrillComplete ? '#FFFFFF' : theme.text }}>
              {isCurrentDrillComplete ? 'Completed' : 'Mark Complete'}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleNext}
            disabled={currentDrillIndex >= activeWorkout.drills.length - 1}
            style={[
              styles.navButton,
              { backgroundColor: theme.backgroundDefault, opacity: currentDrillIndex >= activeWorkout.drills.length - 1 ? 0.3 : 1 },
            ]}
          >
            <Feather name="chevron-right" size={24} color={theme.text} />
          </Pressable>
        </View>
      </View>

      <Modal visible={showCompleteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundRoot }]}>
            <ScreenKeyboardAwareScrollView>
              <View style={styles.modalCenter}>
                <Image
                  source={require('@/assets/images/trophy.png')}
                  style={styles.trophy}
                  contentFit="contain"
                />
                <ThemedText style={styles.modalTitle}>Great Work!</ThemedText>
                <ThemedText style={[styles.modalSubtitle, { color: theme.tabIconDefault }]}>
                  You completed {completedCount} of {activeWorkout.drills.length} drills in {formatTime(sessionTime)}
                </ThemedText>

                <View style={styles.difficultySection}>
                  <ThemedText style={styles.fieldLabel}>How difficult was this workout?</ThemedText>
                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Pressable key={star} onPress={() => setDifficulty(star)}>
                        <Feather
                          name="star"
                          size={32}
                          color={star <= difficulty ? theme.warning : theme.tabIconDefault}
                          fill={star <= difficulty ? theme.warning : 'none'}
                        />
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.notesSection}>
                  <ThemedText style={styles.fieldLabel}>Notes (optional)</ThemedText>
                  <TextInput
                    style={[
                      styles.notesInput,
                      { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border },
                    ]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="How did you feel? Any observations?"
                    placeholderTextColor={theme.tabIconDefault}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <Button onPress={handleSaveSession}>Save Workout</Button>
                <Pressable onPress={() => setShowCompleteModal(false)} style={styles.cancelButton}>
                  <ThemedText style={[styles.cancelText, { color: theme.tabIconDefault }]}>Cancel</ThemedText>
                </Pressable>
              </View>
            </ScreenKeyboardAwareScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTimer: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    marginBottom: Spacing.xxl,
  },
  drillName: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  centerStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  statBox: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: 14,
  },
  statBig: {
    fontSize: 48,
    fontWeight: '700',
  },
  restContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  restLabel: {
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  restTimer: {
    fontSize: 56,
    fontWeight: '700',
  },
  restButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
  },
  restButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
  },
  instructionsText: {
    fontSize: 15,
    lineHeight: 22,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 48,
    borderRadius: BorderRadius.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingTop: Spacing.xl,
  },
  modalCenter: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  trophy: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  difficultySection: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  notesSection: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 16,
    minHeight: 100,
  },
  cancelButton: {
    marginTop: Spacing.md,
    padding: Spacing.md,
  },
  cancelText: {
    fontSize: 16,
  },
});
