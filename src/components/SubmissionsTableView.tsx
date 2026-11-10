import React, { useState, useMemo } from 'react';
import {
  StudentSubmission,
  UserProfile,
} from '../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  Download,
  Eye,
  Edit3,
  FileText,
  FileCheck2,
  Printer,
  Sparkles,
  X,
  AlertCircle,
  ThumbsUp,
  Star,
} from 'lucide-react';

interface SubmissionsTableViewProps {
  currentUser: UserProfile;
  submissions: StudentSubmission[];
  onGradeSubmission: (
    submissionId: string,
    score: number,
    teacherFeedback: string
  ) => void;
}

export const SubmissionsTableView: React.FC<SubmissionsTableViewProps> = ({
  currentUser,
  submissions,
  onGradeSubmission,
}) => {
  const isGuru = currentUser.role === 'guru';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [selectedSubject, setSelectedSubject] = useState('Semua');
  const [selectedGradingStatus, setSelectedGradingStatus] = useState('Semua');

  // Grading Modal State
  const [gradingTarget, setGradingTarget] = useState<StudentSubmission | null>(null);
  const [inputScore, setInputScore] = useState<string>('');
  const [inputFeedback, setInputFeedback] = useState<string>('');

  // File Preview Modal
  const [previewFile, setPreviewFile] = useState<StudentSubmission | null>(null);

  const classesList = ['Semua', 'Kelas 5A', 'Kelas 5B', 'Kelas 4A', 'Kelas 6A'];
  const subjectsList = [
    'Semua',
    'Matematika',
    'IPA',
    'Bahasa Indonesia',
    'Pendidikan Pancasila',
    'Seni Budaya & Prakarya',
    'PJOK',
  ];

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // If student, can see all or prioritize own
      const matchesSearch =
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClass =
        selectedClass === 'Semua' || item.classGroup === selectedClass;

      const matchesSubject =
        selectedSubject === 'Semua' || item.subject === selectedSubject;

      const matchesGradingStatus =
        selectedGradingStatus === 'Semua' ||
        item.gradingStatus === selectedGradingStatus;

      return matchesSearch && matchesClass && matchesSubject && matchesGradingStatus;
    });
  }, [submissions, searchQuery, selectedClass, selectedSubject, selectedGradingStatus]);

  // Handle open grading modal
  const handleOpenGradeModal = (submission: StudentSubmission) => {
    setGradingTarget(submission);
    setInputScore(submission.score !== null && submission.score !== undefined ? String(submission.score) : '90');
    setInputFeedback(submission.teacherFeedback || 'Pekerjaan sangat baik, jawaban runut dan rapi!');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingTarget) return;

    const numScore = Math.min(100, Math.max(0, Number(inputScore) || 0));
    onGradeSubmission(gradingTarget.id, numScore, inputFeedback.trim());
    setGradingTarget(null);
  };

  const handleQuickFeedback = (text: string) => {
    setInputFeedback((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handlePrintTable = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <FileCheck2 className="w-4 h-4" />
            <span>Rekapitulasi Pengumpulan Tugas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
            Data Pengumpulan Tugas Murid
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {isGuru
              ? 'Kelola, periksa berkas, dan berikan nilai serta catatan apresiasi/perbaikan kepada seluruh murid.'
              : 'Pantau status pengerjaan, nilai, dan umpan balik dari guru atas tugas yang telah dikumpulkan.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrintTable}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Toolbar Filters & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search by student name */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama murid, judul tugas, berkas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Filter Kelas */}
          <div className="md:col-span-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden font-medium text-slate-700 cursor-pointer"
            >
              <option value="Semua">Semua Kelas</option>
              {classesList.slice(1).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Mata Pelajaran */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden font-medium text-slate-700 cursor-pointer"
            >
              <option value="Semua">Semua Mapel</option>
              {subjectsList.slice(1).map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status Penilaian */}
          <div className="md:col-span-2">
            <select
              value={selectedGradingStatus}
              onChange={(e) => setSelectedGradingStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden font-medium text-slate-700 cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Penilaian">Belum Dinilai</option>
              <option value="Sudah Dinilai">Sudah Dinilai</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Menampilkan <strong className="text-slate-800">{filteredSubmissions.length}</strong> dari{' '}
            <strong className="text-slate-800">{submissions.length}</strong> total pengumpulan tugas.
          </div>
          {(searchQuery || selectedClass !== 'Semua' || selectedSubject !== 'Semua' || selectedGradingStatus !== 'Semua') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedClass('Semua');
                setSelectedSubject('Semua');
                setSelectedGradingStatus('Semua');
              }}
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Submissions Table (Desktop & Tablet) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 text-center w-12">No.</th>
                <th className="py-3.5 px-4">Nama Murid</th>
                <th className="py-3.5 px-3">Kelas</th>
                <th className="py-3.5 px-3">Mata Pelajaran</th>
                <th className="py-3.5 px-4">Nama Tugas</th>
                <th className="py-3.5 px-3">Waktu Kirim</th>
                <th className="py-3.5 px-3">File Tugas</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-center">Nilai</th>
                <th className="py-3.5 px-4">Catatan Guru</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <Search className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-slate-700">Tidak ada data ditemukan</div>
                      <div className="text-xs">Coba sesuaikan kata kunci pencarian atau reset filter.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, index) => {
                  const isCurrentUsersSubmission = sub.studentId === currentUser.id;
                  const isGraded = sub.gradingStatus === 'Sudah Dinilai';

                  return (
                    <tr
                      key={sub.id}
                      className={`hover:bg-sky-50/40 transition-colors ${
                        isCurrentUsersSubmission ? 'bg-sky-50/20 font-medium' : ''
                      }`}
                    >
                      {/* 1. Nomor */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400 tabular-nums">
                        {index + 1}
                      </td>

                      {/* 2. Nama Murid */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{sub.studentName}</span>
                          {isCurrentUsersSubmission && (
                            <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-1.5 py-0.2 rounded-xs">
                              Kamu
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Kelas */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 font-semibold">
                        {sub.classGroup}
                      </td>

                      {/* 4. Mata Pelajaran */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 text-xs">
                          {sub.subject}
                        </span>
                      </td>

                      {/* 5. Nama Tugas */}
                      <td className="py-3.5 px-4 min-w-[200px] max-w-[280px]">
                        <div className="font-medium text-slate-800 line-clamp-2" title={sub.assignmentTitle}>
                          {sub.assignmentTitle}
                        </div>
                        {sub.notes && (
                          <div className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1" title={sub.notes}>
                            "{sub.notes}"
                          </div>
                        )}
                      </td>

                      {/* 6. Tanggal Pengumpulan */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-600">
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{sub.submittedAt}</span>
                        </div>
                      </td>

                      {/* 7. File Tugas */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          onClick={() => setPreviewFile(sub)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 text-xs font-semibold transition-colors cursor-pointer"
                          title="Klik untuk melihat berkas tugas"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-600" />
                          <span className="max-w-[100px] truncate">{sub.fileName}</span>
                        </button>
                      </td>

                      {/* 8. Status Pengumpulan */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            sub.submissionStatus === 'Tepat Waktu'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {sub.submissionStatus}
                        </span>
                      </td>

                      {/* 9. Nilai */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold tabular-nums text-xs sm:text-sm">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            {sub.score}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium">
                            <Clock className="w-3 h-3" />
                            Belum Dinilai
                          </span>
                        )}
                      </td>

                      {/* 10. Catatan Guru */}
                      <td className="py-3.5 px-4 min-w-[200px] max-w-[260px]">
                        {sub.teacherFeedback ? (
                          <div className="text-xs text-slate-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 italic line-clamp-2">
                            "{sub.teacherFeedback}"
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Belum ada catatan
                          </span>
                        )}
                      </td>

                      {/* 11. Aksi */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isGuru ? (
                          <button
                            onClick={() => handleOpenGradeModal(sub)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isGraded ? 'Ubah Nilai' : 'Beri Nilai'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setPreviewFile(sub)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Rincian</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Teacher Grading Modal */}
      {gradingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Penilaian Tugas Murid
                  </h3>
                  <span className="text-xs text-slate-500">
                    Formulir Evaluasi & Catatan Umpan Balik Guru
                  </span>
                </div>
              </div>
              <button
                onClick={() => setGradingTarget(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Student & Task Overview */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Nama Murid:</span>
                <span className="font-bold text-slate-900">{gradingTarget.studentName} ({gradingTarget.classGroup})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Mata Pelajaran:</span>
                <span className="font-bold text-sky-700">{gradingTarget.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Judul Tugas:</span>
                <span className="font-bold text-slate-800 max-w-[240px] truncate text-right">
                  {gradingTarget.assignmentTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Berkas Dikirim:</span>
                <span className="font-bold text-slate-800">{gradingTarget.fileName} ({gradingTarget.fileSize})</span>
              </div>
              {gradingTarget.notes && (
                <div className="pt-1.5 border-t border-slate-200 text-slate-600 italic">
                  Catatan dari murid: "{gradingTarget.notes}"
                </div>
              )}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              {/* Score Input (0 - 100) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Nilai Skor (Skala 0 - 100)</span>
                  <span className="text-xs text-sky-600 font-normal">Kriteria Ketuntasan Minimal (KKM): 75</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={inputScore}
                    onChange={(e) => setInputScore(e.target.value)}
                    className="w-32 px-4 py-2.5 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 tabular-nums text-center"
                    placeholder="Contoh: 95"
                  />
                  <div className="flex items-center gap-1.5">
                    {[80, 85, 90, 95, 100].map((quickScore) => (
                      <button
                        key={quickScore}
                        type="button"
                        onClick={() => setInputScore(String(quickScore))}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          inputScore === String(quickScore)
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {quickScore}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catatan Guru & Umpan Balik Perbaikan
                </label>
                <textarea
                  rows={3}
                  value={inputFeedback}
                  onChange={(e) => setInputFeedback(e.target.value)}
                  placeholder="Tuliskan apresiasi, saran, atau catatan perbaikan untuk murid..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 leading-relaxed"
                />

                {/* Quick Feedback Snippets */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Saran Cepat:
                  </span>
                  {[
                    'Sangat rapi dan memuaskan!',
                    'Penyelesaian soal sangat runtut.',
                    'Luar biasa, pertahankan prestasimu!',
                    'Perhatikan kembali ketelitian hitungan.',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuickFeedback(preset)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Nilai & Komentar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Pratinjau Berkas Tugas
                  </h4>
                  <span className="text-xs text-slate-500">
                    {previewFile.fileName} ({previewFile.fileSize})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
                <FileCheck2 className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {previewFile.assignmentTitle}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Oleh: {previewFile.studentName} · {previewFile.classGroup}
                </div>
              </div>
              <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 max-w-sm mx-auto">
                Berkas diverifikasi aman dan terenkripsi dalam format {previewFile.fileType}. Waktu kirim: {previewFile.submittedAt}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Mengunduh berkas salinan: ${previewFile.fileName}`);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Asli</span>
              </button>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
