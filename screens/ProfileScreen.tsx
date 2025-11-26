import { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { StorageService } from '@/utils/storage';
import { UserProfile } from '@/types';
import type { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "Profile">;
};

const AVATARS = [
  { key: 'dunk' as const, label: 'Dunking', source: require('@/assets/avatars/avatar-dunk.png') },
  { key: 'shoot' as const, label: 'Shooting', source: require('@/assets/avatars/avatar-shoot.png') },
  { key: 'dribble' as const, label: 'Dribbling', source: require('@/assets/avatars/avatar-dribble.png') },
];

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { theme, isDark } = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    displayName: 'Player',
    avatar: 'dunk',
    soundEnabled: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const saved = await StorageService.getProfile();
    setProfile(saved);
  };

  const handleSave = async () => {
    await StorageService.saveProfile(profile);
    setIsEditing(false);
  };

  const selectedAvatar = AVATARS.find(a => a.key === profile.avatar) || AVATARS[0];

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.avatarSection}>
        <Image
          source={selectedAvatar.source}
          style={styles.avatar}
          contentFit="contain"
        />
        <ThemedText style={styles.greeting}>Hello, {profile.displayName}!</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Profile</ThemedText>
          {isEditing ? (
            <Pressable onPress={handleSave}>
              <ThemedText style={[styles.editButton, { color: theme.primary }]}>Save</ThemedText>
            </Pressable>
          ) : (
            <Pressable onPress={() => setIsEditing(true)}>
              <Feather name="edit-2" size={20} color={theme.primary} />
            </Pressable>
          )}
        </View>

        {isEditing ? (
          <>
            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>Display Name</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundRoot, color: theme.text, borderColor: theme.border },
                ]}
                value={profile.displayName}
                onChangeText={(text) => setProfile({ ...profile, displayName: text })}
                placeholder="Enter your name"
                placeholderTextColor={theme.tabIconDefault}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>Choose Avatar</ThemedText>
              <View style={styles.avatarGrid}>
                {AVATARS.map((avatar) => (
                  <Pressable
                    key={avatar.key}
                    onPress={() => setProfile({ ...profile, avatar: avatar.key })}
                    style={[
                      styles.avatarOption,
                      {
                        borderColor: profile.avatar === avatar.key ? theme.primary : theme.border,
                        borderWidth: profile.avatar === avatar.key ? 3 : 1,
                      },
                    ]}
                  >
                    <Image
                      source={avatar.source}
                      style={styles.avatarOptionImage}
                      contentFit="contain"
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.field}>
            <ThemedText style={[styles.displayValue, { color: theme.tabIconDefault }]}>
              {profile.displayName}
            </ThemedText>
            <ThemedText style={[styles.displayValue, { color: theme.tabIconDefault }]}>
              Avatar: {selectedAvatar.label}
            </ThemedText>
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText style={styles.cardTitle}>Preferences</ThemedText>
        
        <Pressable
          onPress={() => setProfile({ ...profile, soundEnabled: !profile.soundEnabled })}
          style={styles.settingRow}
          onPressIn={() => handleSave()}
        >
          <View style={styles.settingLeft}>
            <Feather name="volume-2" size={20} color={theme.text} />
            <ThemedText style={styles.settingLabel}>Sound Effects</ThemedText>
          </View>
          <View
            style={[
              styles.toggle,
              { backgroundColor: profile.soundEnabled ? theme.primary : theme.tabIconDefault },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                {
                  backgroundColor: '#FFFFFF',
                  transform: [{ translateX: profile.soundEnabled ? 20 : 0 }],
                },
              ]}
            />
          </View>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText style={styles.cardTitle}>About</ThemedText>
        <View style={styles.aboutRow}>
          <ThemedText style={[styles.aboutLabel, { color: theme.tabIconDefault }]}>
            Version
          </ThemedText>
          <ThemedText style={styles.aboutValue}>1.0.0</ThemedText>
        </View>
        <View style={styles.aboutRow}>
          <ThemedText style={[styles.aboutLabel, { color: theme.tabIconDefault }]}>
            App Name
          </ThemedText>
          <ThemedText style={styles.aboutValue}>Basketball Workout</ThemedText>
        </View>
      </View>

      <View style={styles.testSection}>
        <Button
          onPress={() => navigation.navigate("Crash")}
          style={styles.crashButton}
        >
          Test Crash Recovery
        </Button>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
  },
  card: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  field: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  avatarOption: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
  },
  displayValue: {
    fontSize: 15,
    marginBottom: Spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  aboutLabel: {
    fontSize: 15,
  },
  aboutValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  testSection: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  crashButton: {
    backgroundColor: "#FF3B30",
  },
});
