import React, { useState, useMemo } from 'react';
import {
  ActiveTab,
  Assignment,
  AssignmentStatus,
  StudentSubmission,
  Subject,
  UserProfile,
} from '../types';
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  User,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Download,
  Trash2,
  Edit,
  ArrowRight,
  Sparkles,
  School,
  ExternalLink,
} from 'lucide-react';

interface AssignmentsViewProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  submissions: StudentSubmission[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectAssignmentForUpload: (assignment: Assignment) => void;
  onOpenCreateAssignmentModal: () => void;
  onEditAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  currentUser,
  assignments,
  submissions,
  setActiveTab,
  onSelectAssignmentForUpload,
  onOpenCreateAssignmentModal,
  onEditAssignment,
  onDeleteAssignment,
}) => {
  const isGuru = currentUser.role === 'guru';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Compute status for an assignment based on current user (or general for teacher)
  const getAssignmentStatus = (assignment: Assignment): {
    status: AssignmentStatus;
    submission?: StudentSubmission;
  } => {
    if (isGuru) {
      // For teacher: check if any student has submitted
      const relatedSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
      const gradedCount = relatedSubmissions.filter((s) => s.gradingStatus === 'Sudah Dinilai').length;
      if (relatedSubmissions.length === 0) return { status: 'Belum dikerjakan' };
      if (gradedCount === relatedSubmissions.length && relatedSubmissions.length > 0) {
        return { status: 'Sudah dinilai' };
      }
      return { status: 'Sudah dikumpulkan' };
    }

    // For student: check current student's submission
    const studentSub = submissions.find(
      (s) => s.assignmentId === assignment.id && s.studentId === currentUser.id
    );

    if (!studentSub) {
      // Check if overdue
      const isOverdue = new Date(assignment.rawDueDate).getTime() < new Date('2026-11-09T18:00:00').getTime();
      return { status: isOverdue ? 'Terlambat' : 'Belum dikerjakan' };
    }

    if (studentSub.gradingStatus === 'Sudah Dinilai') {
      return { status: 'Sudah dinilai', submission: studentSub };
    }

    return { status: 'Sudah dikumpulkan', submission: studentSub };
  };

  const subjectsList = [
    'Semua',
    'Matematika',
    'IPA',
    'Bahasa Indonesia',
    'Pendidikan Pancasila',
    'Seni Budaya & Prakarya',
    'PJOK',
    'Pendidikan Agama Islam',
  ];

  const statusesList = [
    'Semua',
    'Belum dikerjakan',
    'Sudah dikumpulkan',
    'Terlambat',
    'Sudah dinilai',
  ];

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      // Search filter
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

      // Subject filter
      const matchesSubject =
        selectedSubject === 'Semua' || item.subject === selectedSubject;

      // Status filter
      const { status } = getAssignmentStatus(item);
      const matchesStatus =
        selectedStatus === 'Semua' || status === selectedStatus;

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [assignments, searchQuery, selectedSubject, selectedStatus, currentUser, submissions]);

  const getStatusBadge = (status: AssignmentStatus, score?: number | null) => {
    switch (status) {
      case 'Sudah dinilai':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Sudah Dinilai {score !== undefined && score !== null ? `(${score}/100)` : ''}
          </span>
        );
      case 'Sudah dikumpulkan':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <FileCheck2 className="w-3.5 h-3.5 text-sky-600" />
            Sudah Dikumpulkan
          </span>
        );
      case 'Terlambat':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Terlambat
          </span>
        );
      case 'Belum dikerjakan':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Belum Dikerjakan
          </span>
        );
    }
  };

  const getSubjectColor = (subject: Subject) => {
    switch (subject) {
      case 'Matematika':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IPA':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Bahasa Indonesia':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pendidikan Pancasila':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Seni Budaya & Prakarya':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'PJOK':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <BookOpen className="w-4 h-4" />
            <span>Pusat Pembelajaran & Penugasan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
            Informasi Tugas Sekolah
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Daftar tugas resmi yang diberikan guru untuk Kelas 5A SD Smart Nusantara.
          </p>
        </div>

        {isGuru && (
          <button
            onClick={onOpenCreateAssignmentModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul tugas, mata pelajaran, materi, atau nama guru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-colors"
            />
          </div>

          {/* Subject Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-slate-700 cursor-pointer"
            >
              <option value="Semua">Semua Mata Pelajaran</option>
              {subjectsList.slice(1).map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-slate-700 cursor-pointer"
            >
              <option value="Semua">Semua Status Tugas</option>
              {statusesList.slice(1).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Tag Pills for Subject */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-semibold">
          <span className="text-slate-400 text-xs shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Cepat:
          </span>
          {subjectsList.slice(0, 5).map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedSubject === subj
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
          {selectedSubject !== 'Semua' && (
            <button
              onClick={() => setSelectedSubject('Semua')}
              className="text-xs text-rose-600 hover:underline px-2 py-1 shrink-0 font-bold"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Assignment List Cards */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Tidak ada tugas ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Tidak ada tugas yang sesuai dengan kata kunci pencarian atau filter yang dipilih. Silakan coba atur ulang filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('Semua');
              setSelectedStatus('Semua');
            }}
            className="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 text-xs font-bold hover:bg-sky-200 transition-colors"
          >
            Hapus Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment) => {
            const { status, submission } = getAssignmentStatus(assignment);
            const subjectColorClass = getSubjectColor(assignment.subject);

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar on Card: Subject Badge, Class & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${subjectColorClass}`}>
                        {assignment.subject}
                      </span>
                      <span className="text-xs font-bold text-slate-400">·</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {assignment.classGroup}
                      </span>
                    </div>
                    <div>{getStatusBadge(status, submission?.score)}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {assignment.title}
                  </h3>

                  {/* Description / Petunjuk Pengerjaan */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Petunjuk Pengerjaan:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {assignment.description}
                    </p>
                  </div>

                  {/* Metadata: Guru, Tanggal Pemberian, Batas Waktu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Guru: <strong className="text-slate-800">{assignment.teacherName}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Diberikan: {assignment.assignedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2 text-rose-700 font-semibold bg-rose-50/60 p-2 rounded-lg border border-rose-100">
                      <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Batas Pengumpulan: <strong>{assignment.dueDate}</strong></span>
                    </div>
                  </div>

                  {/* Lampiran / Materi Pendukung if any */}
                  {assignment.attachmentName && (
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-800">
                        <Paperclip className="w-3.5 h-3.5 text-sky-600" />
                        <span className="font-semibold">{assignment.attachmentName}</span>
                        {assignment.attachmentSize && (
                          <span className="text-[10px] text-sky-600 font-bold">({assignment.attachmentSize})</span>
                        )}
                        <button
                          onClick={() => alert(`Simulasi mengunduh berkas: ${assignment.attachmentName}`)}
                          className="ml-1 text-sky-600 hover:text-sky-900 cursor-pointer font-bold underline"
                        >
                          Unduh
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Catatan hasil nilai untuk murid jika sudah dinilai */}
                  {submission && submission.gradingStatus === 'Sudah Dinilai' && (
                    <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>Nilai Kamu: {submission.score} / 100</span>
                        <span className="text-[11px] text-emerald-700">Tepat Waktu</span>
                      </div>
                      {submission.teacherFeedback && (
                        <p className="text-emerald-800 italic">
                          "Catatan Guru: {submission.teacherFeedback}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                  {isGuru ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEditAssignment(assignment)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-sky-700 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus tugas "${assignment.title}"?`)) {
                              onDeleteAssignment(assignment.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-100 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Hapus</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setActiveTab('data-murid')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>Lihat Pengumpulan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">
                        Skor Maksimal: <strong>{assignment.maxScore}</strong>
                      </span>

                      {status === 'Belum dikerjakan' || status === 'Terlambat' ? (
                        <button
                          onClick={() => onSelectAssignmentForUpload(assignment)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>Kumpulkan Sekarang</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('data-murid')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Lihat Bukti Kirim</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
