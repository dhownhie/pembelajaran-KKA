import {
  Assignment,
  Announcement,
  LearningMaterial,
  StudentSubmission,
  UserProfile,
} from '../types';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MATERIALS,
  INITIAL_SUBMISSIONS,
  INITIAL_TEACHER,
  INITIAL_STUDENT,
} from '../data/initialData';

const STORAGE_KEYS = {
  CURRENT_USER: 'smart_class_current_user',
  ASSIGNMENTS: 'smart_class_assignments',
  SUBMISSIONS: 'smart_class_submissions',
  ANNOUNCEMENTS: 'smart_class_announcements',
  MATERIALS: 'smart_class_materials',
};

export const loadStoredUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored user', e);
  }
  return INITIAL_STUDENT;
};

export const saveStoredUser = (user: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user', e);
  }
};

export const loadStoredAssignments = (): Assignment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading assignments', e);
  }
  return INITIAL_ASSIGNMENTS;
};

export const saveStoredAssignments = (assignments: Assignment[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  } catch (e) {
    console.error('Error saving assignments', e);
  }
};

export const loadStoredSubmissions = (): StudentSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading submissions', e);
  }
  return INITIAL_SUBMISSIONS;
};

export const saveStoredSubmissions = (submissions: StudentSubmission[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  } catch (e) {
    console.error('Error saving submissions', e);
  }
};

export const loadStoredAnnouncements = (): Announcement[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading announcements', e);
  }
  return INITIAL_ANNOUNCEMENTS;
};

export const saveStoredAnnouncements = (announcements: Announcement[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  } catch (e) {
    console.error('Error saving announcements', e);
  }
};

export const loadStoredMaterials = (): LearningMaterial[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading materials', e);
  }
  return INITIAL_MATERIALS;
};

export const saveStoredMaterials = (materials: LearningMaterial[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  } catch (e) {
    console.error('Error saving materials', e);
  }
};

export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
  localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
  localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
  localStorage.removeItem(STORAGE_KEYS.MATERIALS);
  window.location.reload();
};
