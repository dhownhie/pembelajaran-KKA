export type UserRole = 'guru' | 'murid';

export type Subject =
  | 'Matematika'
  | 'IPA'
  | 'Bahasa Indonesia'
  | 'Pendidikan Pancasila'
  | 'Seni Budaya & Prakarya'
  | 'PJOK'
  | 'Pendidikan Agama Islam';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  classGroup: string;
  idNumber: string; // NIP untuk guru, NISN untuk murid
  username: string;
  email: string;
  avatarUrl: string;
  starsCount?: number;
  bio?: string;
  completedTasksCount?: number;
  averageScore?: number;
}

export type AssignmentStatus =
  | 'Belum dikerjakan'
  | 'Sudah dikumpulkan'
  | 'Terlambat'
  | 'Sudah dinilai';

export interface Assignment {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  teacherName: string;
  classGroup: string;
  assignedDate: string; // e.g. "05 Nov 2026"
  dueDate: string;      // e.g. "12 Nov 2026, 23:59 WIB"
  rawDueDate: string;   // ISO format for deadline comparison
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentSize?: string;
  maxScore: number;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  subject: Subject;
  studentId: string;
  studentName: string;
  classGroup: string;
  submittedAt: string; // e.g. "09 Nov 2026, 09:15 WIB"
  fileName: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'JPG' | 'PNG';
  notes?: string;
  submissionStatus: 'Tepat Waktu' | 'Terlambat';
  gradingStatus: 'Menunggu Penilaian' | 'Sudah Dinilai';
  score?: number | null;
  teacherFeedback?: string;
  gradedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Jadwal & Info' | 'Tugas Baru' | 'Ujian' | 'Kegiatan Sekolah' | 'Pengingat';
  content: string;
  author: string;
  date: string;
  pinned: boolean;
  badgeColor?: string;
}

export interface LearningMaterial {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  author: string;
  classGroup: string;
  type: 'PDF' | 'Video' | 'Modul' | 'Tautan';
  fileName: string;
  fileSize?: string;
  date: string;
  downloadUrl?: string;
}

export type ActiveTab =
  | 'beranda'
  | 'tugas'
  | 'kumpulkan'
  | 'data-murid'
  | 'pengumuman'
  | 'materi'
  | 'profil';
