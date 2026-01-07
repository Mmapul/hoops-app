import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';

interface VideoPlayerProps {
  videoUrl?: string;
  drillName: string;
}

export function VideoPlayer({ videoUrl, drillName }: VideoPlayerProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  if (!videoUrl) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
        <Feather name="video-off" size={32} color={theme.tabIconDefault} />
        <ThemedText style={styles.noVideoText}>No video available</ThemedText>
      </View>
    );
  }

  const handlePlayVideo = async () => {
    setIsLoading(true);
    try {
      const canOpen = await Linking.canOpenURL(videoUrl);
      if (canOpen) {
        await Linking.openURL(videoUrl);
      } else {
        // Fallback for web or if direct URL fails
        window.open(videoUrl, '_blank');
      }
    } catch {
      // Final fallback
      window.open(videoUrl, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePlayVideo}
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
      disabled={isLoading}
    >
      <Feather name="play-circle" size={48} color={theme.primary} />
      <ThemedText style={styles.videoLabel}>Watch Demo: {drillName}</ThemedText>
      <ThemedText style={[styles.playText, { color: theme.tabIconDefault }]}>
        {isLoading ? 'Opening...' : 'Tap to view'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginVertical: Spacing.md,
  },
  noVideoText: {
    marginTop: Spacing.sm,
    fontSize: 14,
  },
  videoLabel: {
    marginTop: Spacing.md,
    fontSize: 16,
    fontWeight: '600',
  },
  playText: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
