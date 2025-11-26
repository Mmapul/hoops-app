import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Spacing } from '@/constants/theme';

export default function CrashScreen() {
  const handleCrash = () => {
    throw new Error('Test crash - verifying ErrorBoundary functionality');
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Error Boundary Test</ThemedText>
      <ThemedText style={styles.description}>
        This button will intentionally crash the app to test the error recovery system.
      </ThemedText>
      <Button onPress={handleCrash}>Trigger Crash</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    opacity: 0.7,
  },
});
