import { GroupState } from '../types';

const STORAGE_KEY = 'human-enough-quiz-state';

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
