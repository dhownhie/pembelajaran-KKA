import React from 'react';
import { UserProfile, UserRole } from '../types';
import {
  GraduationCap,
  School,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  X,
} from 'lucide-react';
import {
  INITIAL_STUDENT,
  INITIAL_TEACHER,
  STUDENT_AVATAR,
  TEACHER_AVATAR,
} from '../data/initialData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserProfile) => void;
  currentUser: UserProfile;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  currentUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Masuk ke SMART CLASS
              </h3>
              <span className="text-xs text-slate-500">
                Pilih peran akun Anda untuk melanjutkan
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            SMART CLASS dirancang dengan hak akses khusus untuk Bapak/Ibu Guru dan Murid Sekolah Dasar. Silakan pilih mode akun yang ingin Anda gunakan:
          </p>

          {/* Option 1: Masuk Sebagai GURU */}
          <div
            onClick={() => {
              onSelectUser(INITIAL_TEACHER);
              onClose();
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-start gap-4 ${
              currentUser.role === 'guru'
                ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-200'
                : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30'
            }`}
          >
            <img
              src={TEACHER_AVATAR}
              alt="Ibu Guru"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-300 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                  Akses Guru
                </span>
                {currentUser.role === 'guru' && (
                  <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    Sedang Digunakan
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-sky-700 transition-colors">
                Ibu Siti Nurhaliza, S.Pd.
              </h4>
              <p className="text-xs text-slate-500">
                Hak akses: Menambah & edit tugas, memeriksa pengumpulan seluruh murid, memberikan skor & catatan perbaikan, serta membuat pengumuman sekolah.
              </p>
            </div>
          </div>

          {/* Option 2: Masuk Sebagai MURID */}
          <div
            onClick={() => {
              onSelectUser(INITIAL_STUDENT);
              onClose();
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-start gap-4 ${
              currentUser.role === 'murid'
                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200'
                : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            <img
              src={STUDENT_AVATAR}
              alt="Murid"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-300 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Akses Murid
                </span>
                {currentUser.role === 'murid' && (
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Sedang Digunakan
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                Ahmad Raditya Pratama (Kelas 5A)
              </h4>
              <p className="text-xs text-slate-500">
                Hak akses: Melihat instruksi tugas, mengunggah hasil PR/tugas, memantau nilai & bintang prestasi, membaca materi belajar, dan melihat pengumuman guru.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
