import { GroupState } from '../types';

const STORAGE_KEY = 'human-enough-quiz-state';
const ATTEMPTS_KEY = 'human-enough-quiz-attempts';

export const getGroupState = (groupId: string): GroupState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const allStates: Record<string, GroupState> = JSON.parse(stored);
    return allStates[groupId] || null;
  } catch {
    return null;
  }
};

export const saveGroupState = (state: GroupState): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allStates: Record<string, GroupState> = stored ? JSON.parse(stored) : {};

    allStates[state.groupId] = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStates));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const getAttempts = (groupId: string): number => {
  try {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    if (!stored) return 0;

    const allAttempts: Record<string, number> = JSON.parse(stored);
    return allAttempts[groupId] || 0;
  } catch {
    return 0;
  }
};

export const incrementAttempts = (groupId: string): number => {
  try {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    const allAttempts: Record<string, number> = stored ? JSON.parse(stored) : {};

    const currentAttempts = allAttempts[groupId] || 0;
    const newAttempts = currentAttempts + 1;
    allAttempts[groupId] = newAttempts;
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(allAttempts));
    return newAttempts;
  } catch (error) {
    console.error('Failed to increment attempts:', error);
    return 0;
  }
};

export const clearGroupState = (groupId: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const allStates: Record<string, GroupState> = JSON.parse(stored);
    delete allStates[groupId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStates));
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
};
