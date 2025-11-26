import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Share, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Button } from './Button';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { WorkoutSession } from '@/types';

interface SocialShareCardProps {
  session: WorkoutSession;
  onShare?: (platform: string) => void;
}

export function SocialShareCard({ session, onShare }: SocialShareCardProps) {
  const { theme } = useTheme();
  const [isSharing, setIsSharing] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const shareMessage = `Just completed ${session.workoutName}! I completed ${session.completedDrills.filter(d => d.completed).length}/${session.completedDrills.length} drills in ${Math.floor(session.totalTime / 60)} minutes. Join me on this basketball journey!`;

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await Share.share({
        message: shareMessage,
        title: `${session.workoutName} - Basketball Workout`,
      });
      if (result.action === Share.dismissedAction) {
        // dismissed
      } else {
        onShare?.('native');
      }
    } catch {
      Alert.alert('Error', 'Failed to share workout');
    } finally {
      setIsSharing(false);
    }
  };

  const handleSocialPlatform = (platform: string) => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodedMessage}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing via URL
    };

    if (platform === 'instagram') {
      Alert.alert('Instagram', 'Please copy the workout message and share it on Instagram Stories or Feed');
    } else {
      Alert.alert('Share', `Opening ${platform}...`);
      onShare?.(platform);
    }
  };

  const completedCount = session.completedDrills.filter(d => d.completed).length;
  const totalCount = session.completedDrills.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <Feather name="share-2" size={24} color={theme.primary} />
        <ThemedText style={styles.title}>Share Your Progress</ThemedText>
      </View>

      <View style={[styles.statsRow, { borderTopColor: theme.tabIconDefault }]}>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{completedCount}/{totalCount}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
            Completed
          </ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{completionRate}%</ThemedText>
          <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
            Done
          </ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{Math.floor(session.totalTime / 60)}m</ThemedText>
          <ThemedText style={[styles.statLabel, { color: theme.tabIconDefault }]}>
            Duration
          </ThemedText>
        </View>
      </View>

      <View style={styles.messagePreview}>
        <ThemedText style={[styles.previewLabel, { color: theme.tabIconDefault }]}>
          Your Message
        </ThemedText>
        <ThemedText style={styles.previewText}>{shareMessage}</ThemedText>
      </View>

      <View style={styles.platformButtons}>
        <Pressable
          style={[styles.platformBtn, { backgroundColor: theme.primary }]}
          onPress={() => handleSocialPlatform('twitter')}
        >
          <Feather name="twitter" size={20} color="#FFFFFF" />
          <ThemedText style={styles.platformBtnText}>Twitter</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.platformBtn, { backgroundColor: theme.primary }]}
          onPress={() => handleSocialPlatform('facebook')}
        >
          <Feather name="facebook" size={20} color="#FFFFFF" />
          <ThemedText style={styles.platformBtnText}>Facebook</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.platformBtn, { backgroundColor: theme.primary }]}
          onPress={() => handleSocialPlatform('instagram')}
        >
          <Feather name="instagram" size={20} color="#FFFFFF" />
          <ThemedText style={styles.platformBtnText}>Instagram</ThemedText>
        </Pressable>
      </View>

      <Button
        title={isSharing ? 'Sharing...' : 'Share Workout'}
        onPress={handleShare}
        variant="primary"
        disabled={isSharing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  messagePreview: {
    marginBottom: Spacing.lg,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  previewText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  platformButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  platformBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.xs,
  },
  platformBtnText: {
    color: '#FFFFFF',
    marginLeft: Spacing.xs,
    fontSize: 12,
    fontWeight: '600',
  },
});
