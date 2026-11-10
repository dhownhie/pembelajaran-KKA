import React from 'react';
import {
  ActiveTab,
  Assignment,
  Announcement,
  StudentSubmission,
  UserProfile,
} from '../types';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  GraduationCap,
  Sparkles,
  Upload,
  ArrowRight,
  AlertCircle,
  Award,
  Bell,
  Users,
  Smile,
} from 'lucide-react';
import { HERO_IMAGE } from '../data/initialData';

interface HomeViewProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  submissions: StudentSubmission[];
  announcements: Announcement[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCreateAssignmentModal?: () => void;
  onOpenCreateAnnouncementModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  assignments,
  submissions,
  announcements,
  setActiveTab,
  onOpenCreateAssignmentModal,
  onOpenCreateAnnouncementModal,
}) => {
  const isGuru = currentUser.role === 'guru';

  // Stats calculation
  const totalAssignments = assignments.length;
  
  // For student: specific to this student
  const studentSubmissions = submissions.filter(
    (s) => s.studentId === currentUser.id
  );
  const submittedAssignmentIds = new Set(studentSubmissions.map((s) => s.assignmentId));

  const totalSubmitted = isGuru
    ? submissions.length
    : studentSubmissions.length;

  const totalPending = isGuru
    ? submissions.filter((s) => s.gradingStatus === 'Menunggu Penilaian').length
    : assignments.filter((a) => !submittedAssignmentIds.has(a.id)).length;

  // New tasks created recently (assigned within last 5 days or all currently active)
  const newTasksCount = assignments.filter((a) => {
    if (isGuru) return true;
    return !submittedAssignmentIds.has(a.id);
  }).length;

  const latestAnnouncements = announcements.slice(0, 3);
  const urgentAssignments = assignments
    .filter((a) => isGuru || !submittedAssignmentIds.has(a.id))
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-500 to-emerald-500 text-white shadow-xl shadow-sky-900/10 p-6 sm:p-10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sky-50 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tahun Ajaran 2026/2027 · Semester Ganjil</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-tight text-white">
              Selamat Datang di <br />
              <span className="text-amber-200">SMART CLASS</span>
            </h1>

            <p className="text-sky-50 text-base sm:text-lg max-w-xl leading-relaxed">
              Platform informasi pembelajaran, komunikasi guru dan murid, serta pengumpulan tugas sekolah dasar modern dan ramah anak.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {isGuru ? (
                <>
                  <button
                    onClick={onOpenCreateAssignmentModal}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-sky-700 font-bold text-sm shadow-md hover:bg-sky-50 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4 text-sky-600" />
                    <span>Buat Tugas Baru</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('data-murid')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-700/60 hover:bg-sky-700 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Periksa Tugas ({totalPending} Baru)</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('kumpulkan')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-sky-700 font-bold text-sm shadow-md hover:bg-sky-50 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>Kumpulkan Tugas Sekarang</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tugas')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-700/60 hover:bg-sky-700 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>Lihat Daftar Tugas ({newTasksCount})</span>
                  </button>
                </>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs sm:text-sm text-sky-100">
              <span className="font-semibold text-white">Login Sebagai:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 font-bold">
                {currentUser.name} ({currentUser.classGroup})
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 aspect-video lg:aspect-4/3 group">
              <img
                src={HERO_IMAGE}
                alt="Ilustrasi Guru dan Murid Sedang Belajar di Kelas Smart Class"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs sm:text-sm font-semibold drop-shadow-md">
                  Suasana Belajar Ceria di SD Smart Nusantara
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Statistics Strip (4 Key Stats) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Total Tugas */}
        <div
          onClick={() => setActiveTab('tugas')}
          className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isGuru ? 'Total Tugas Aktif' : 'Semua Tugas'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              {totalAssignments}
            </span>
            <span className="text-xs font-semibold text-slate-500">Mata Pelajaran</span>
          </div>
          <div className="mt-2 text-xs text-sky-600 font-medium flex items-center gap-1">
            <span>Buka daftar tugas</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Stat 2: Tugas Baru */}
        <div
          onClick={() => setActiveTab('tugas')}
          className="bg-white rounded-2xl p-5 border border-amber-100 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tugas Baru
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-display tabular-nums">
              {newTasksCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">Perlu Dikerjakan</span>
          </div>
          <div className="mt-2 text-xs text-amber-700 font-medium flex items-center gap-1">
            <span>Lihat instruksi tugas</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Stat 3: Tugas Sudah Dikumpulkan */}
        <div
          onClick={() => setActiveTab('data-murid')}
          className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isGuru ? 'Total Terkumpul' : 'Sudah Dikumpulkan'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 font-display tabular-nums">
              {totalSubmitted}
            </span>
            <span className="text-xs font-semibold text-slate-500">Berkas</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <span>{isGuru ? 'Periksa lembar tugas' : 'Cek riwayat pengumpulan'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Stat 4: Tugas Belum Dikumpulkan */}
        <div
          onClick={() => setActiveTab(isGuru ? 'data-murid' : 'tugas')}
          className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isGuru ? 'Menunggu Penilaian' : 'Belum Dikumpulkan'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 font-display tabular-nums">
              {totalPending}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {isGuru ? 'Perlu dinilai' : 'Harus diselesaikan'}
            </span>
          </div>
          <div className="mt-2 text-xs text-rose-700 font-medium flex items-center gap-1">
            <span>{isGuru ? 'Beri nilai sekarang' : 'Selesaikan sebelum batas waktu'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Two Column Grid: Pengumuman Terbaru & Tugas Prioritas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pengumuman Terbaru dari Guru */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                Pengumuman Terbaru dari Guru
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('pengumuman')}
              className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {latestAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => setActiveTab('pengumuman')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-sky-50 text-sky-700 border border-sky-100">
                    {ann.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ann.date}</span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 hover:text-sky-600 transition-colors">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">Oleh: {ann.author}</span>
                  <span className="text-sky-600 font-semibold group-hover:underline">
                    Baca selengkapnya →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {isGuru && onOpenCreateAnnouncementModal && (
            <button
              onClick={onOpenCreateAnnouncementModal}
              className="w-full py-3 rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 text-sky-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Buat Pengumuman Baru untuk Murid</span>
            </button>
          )}
        </div>

        {/* Right Column: Tugas Mendekati Tenggat Waktu & Motivasi */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Tenggat Pengumpulan Terdekat
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('tugas')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                Semua Tugas
              </button>
            </div>

            <div className="space-y-3">
              {urgentAssignments.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setActiveTab('tugas')}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-sky-50/50 hover:border-sky-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span className="text-sky-700 font-bold">{task.subject}</span>
                    <span className="text-rose-600 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3" />
                      {task.dueDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                    {task.title}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{task.classGroup} · {task.teacherName}</span>
                    <span className="text-sky-600 font-bold">Kumpulkan →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kid-Friendly Encouragement Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 shadow-2xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-emerald-950 font-display">
                  Pesan Semangat Hari Ini!
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  "Belajar adalah petualangan seru! Kerjakan tugasmu dengan jujur dan gembira. Jangan ragu bertanya kepada guru jika ada soal yang sulit."
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <Smile className="w-4 h-4 text-emerald-600" />
                  <span>SD Smart Nusantara · Bersama Menggapai Cita-Cita</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
