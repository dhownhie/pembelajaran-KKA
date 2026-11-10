import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  User,
  GraduationCap,
  School,
  Mail,
  KeyRound,
  ShieldCheck,
  Award,
  Star,
  CheckCircle2,
  BookOpen,
  ArrowRightLeft,
  RotateCcw,
  Edit3,
  X,
  Sparkles,
} from 'lucide-react';
import { resetAllData } from '../utils/storage';
import {
  INITIAL_STUDENT,
  INITIAL_TEACHER,
  SAMPLE_STUDENTS,
  STUDENT_AVATAR,
  TEACHER_AVATAR,
} from '../data/initialData';

interface ProfileViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onSwitchUser: (newUser: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  onSwitchUser,
}) => {
  const isGuru = currentUser.role === 'guru';
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(currentUser.name);
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatarUrl);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name: editName.trim(),
      username: editUsername.trim(),
      bio: editBio.trim(),
      avatarUrl: editAvatar,
    });
    setShowEditModal(false);
  };

  const handleSelectPredefinedStudent = (student: { id: string; name: string; classGroup: string }) => {
    onSwitchUser({
      id: student.id,
      name: student.name,
      role: 'murid',
      classGroup: student.classGroup,
      idNumber: `00142981${Math.floor(10 + Math.random() * 89)}`,
      username: student.name.toLowerCase().replace(/\s+/g, '_'),
      email: `${student.name.toLowerCase().split(' ')[0]}@murid.sd-smartclass.sch.id`,
      avatarUrl: STUDENT_AVATAR,
      starsCount: 25,
      bio: `Murid bersemangat di ${student.classGroup}.`,
      completedTasksCount: 12,
      averageScore: 90,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
          <User className="w-4 h-4" />
          <span>Informasi Akun Pengguna</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
          Profil {isGuru ? 'Bapak/Ibu Guru' : 'Murid Pintar'}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Identitas resmi yang terdaftar di Sistem Informasi Guru & Murid SMART CLASS.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          {/* Avatar with role ring */}
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover shadow-md ring-4 ${
                isGuru ? 'ring-sky-400' : 'ring-emerald-400'
              }`}
              referrerPolicy="no-referrer"
            />
            <div
              className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase shadow-sm ${
                isGuru
                  ? 'bg-sky-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {currentUser.role}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                  {currentUser.name}
                </h2>
                <span className="text-xs font-semibold text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <School className="w-3.5 h-3.5 text-sky-600" />
                  <span>{currentUser.classGroup} · SD Smart Nusantara</span>
                </span>
              </div>

              <button
                onClick={() => {
                  setEditName(currentUser.name);
                  setEditUsername(currentUser.username);
                  setEditBio(currentUser.bio || '');
                  setEditAvatar(currentUser.avatarUrl);
                  setShowEditModal(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-center sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Profil</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl pt-1">
              {currentUser.bio || 'Semangat belajar dan meraih cita-cita bersama SMART CLASS!'}
            </p>

            {/* Quick credentials pill bar */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-xs text-slate-600">
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <strong>Username:</strong> @{currentUser.username}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <strong>{isGuru ? 'NIP' : 'NISN'}:</strong> {currentUser.idNumber}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <strong>Email:</strong> {currentUser.email}
              </span>
            </div>
          </div>
        </div>

        {/* Achievement / Activity Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-sky-900 font-display tabular-nums">
              {currentUser.completedTasksCount || 14}
            </div>
            <div className="text-xs font-bold text-sky-700">
              {isGuru ? 'Tugas Dibagikan' : 'Tugas Diselesaikan'}
            </div>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-900 font-display tabular-nums">
              {currentUser.starsCount || 28}
            </div>
            <div className="text-xs font-bold text-amber-700">
              {isGuru ? 'Apresiasi Mengajar' : 'Bintang Keaktifan'}
            </div>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-900 font-display tabular-nums">
              {currentUser.averageScore || 92} / 100
            </div>
            <div className="text-xs font-bold text-emerald-700">
              {isGuru ? 'Rata-rata Skor Kelas' : 'Rata-rata Nilai Tugas'}
            </div>
          </div>
        </div>

        {/* Quick Role Simulation Switcher */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Simulasi Masuk Sebagai Akun Lain (Guru / Murid)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">1-Klik Beralih</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Switch to Teacher */}
            <button
              onClick={() => onSwitchUser(INITIAL_TEACHER)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                isGuru
                  ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200'
                  : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'
              }`}
            >
              <img
                src={TEACHER_AVATAR}
                alt="Ibu Siti"
                className="w-10 h-10 rounded-xl object-cover shadow-xs"
              />
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Ibu Siti Nurhaliza, S.Pd.
                </div>
                <div className="text-[11px] text-sky-700 font-semibold">
                  Guru / Wali Kelas 5A
                </div>
              </div>
              {isGuru && (
                <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                  Aktif
                </span>
              )}
            </button>

            {/* Switch to Student Ahmad */}
            <button
              onClick={() => onSwitchUser(INITIAL_STUDENT)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                !isGuru && currentUser.id === 'student-1'
                  ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <img
                src={STUDENT_AVATAR}
                alt="Ahmad Raditya"
                className="w-10 h-10 rounded-xl object-cover shadow-xs"
              />
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Ahmad Raditya Pratama
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Murid Kelas 5A (SD)
                </div>
              </div>
              {!isGuru && currentUser.id === 'student-1' && (
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  Aktif
                </span>
              )}
            </button>
          </div>

          {/* Quick list of other students to test various submissions */}
          <div className="pt-2">
            <span className="text-xs text-slate-500 font-semibold block mb-2">
              Atau coba masuk sebagai teman sekelas lainnya:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_STUDENTS.slice(1).map((std) => (
                <button
                  key={std.id}
                  onClick={() => handleSelectPredefinedStudent(std)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    currentUser.id === std.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {std.name.split(' ')[0]} ({std.classGroup})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset App State helper */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Perlu mengembalikan data awal simulasi?</span>
          <button
            onClick={() => {
              if (confirm('Pulihkan semua data simulasi tugas, pengumuman, dan materi ke keadaan awal?')) {
                resetAllData();
              }
            }}
            className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Simulasi</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sky-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Ubah Data Profil
                  </h3>
                  <span className="text-xs text-slate-500">Perbarui identitas SMART CLASS</span>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bio / Motto Belajar
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-sky-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
