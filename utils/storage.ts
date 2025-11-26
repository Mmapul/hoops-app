import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession, UserProfile } from '@/types';

const STORAGE_KEYS = {
  SESSIONS: '@basketball_workout:sessions',
  PROFILE: '@basketball_workout:profile',
  BOOKMARKS: '@basketball_workout:bookmarks',
};

export const StorageService = {
  async getSessions(): Promise<WorkoutSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  async saveSession(session: WorkoutSession): Promise<void> {
    try {
      const sessions = await this.getSessions();
      sessions.unshift(session);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  },

  async getProfile(): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : {
        displayName: 'Player',
        avatar: 'dunk',
        soundEnabled: true,
      };
    } catch (error) {
      console.error('Error loading profile:', error);
      return {
        displayName: 'Player',
        avatar: 'dunk',
        soundEnabled: true,
      };
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  },

  async getBookmarks(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  },

  async toggleBookmark(workoutId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      const index = bookmarks.indexOf(workoutId);
      if (index > -1) {
        bookmarks.splice(index, 1);
      } else {
        bookmarks.push(workoutId);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      return index === -1;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  },
};
