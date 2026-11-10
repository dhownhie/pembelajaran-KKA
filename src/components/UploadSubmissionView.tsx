import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Assignment,
  StudentSubmission,
  Subject,
  UserProfile,
} from '../types';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FileCheck2,
  Calendar,
  Clock,
  User,
  School,
  X,
  FileImage,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface UploadSubmissionViewProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  selectedAssignmentForUpload: Assignment | null;
  onSubmitHomework: (submissionData: Omit<StudentSubmission, 'id'>) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const UploadSubmissionView: React.FC<UploadSubmissionViewProps> = ({
  currentUser,
  assignments,
  selectedAssignmentForUpload,
  onSubmitHomework,
  setActiveTab,
}) => {
  // Form fields
  const [studentName, setStudentName] = useState(currentUser.name);
  const [classGroup, setClassGroup] = useState(currentUser.classGroup);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    selectedAssignmentForUpload ? selectedAssignmentForUpload.id : assignments[0]?.id || ''
  );
  const [studentNotes, setStudentNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: 'PDF' | 'DOCX' | 'PPTX' | 'JPG' | 'PNG';
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmissionReceipt, setLastSubmissionReceipt] = useState<{
    studentName: string;
    taskTitle: string;
    subject: string;
    timeString: string;
    fileName: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync selected assignment
  useEffect(() => {
    if (selectedAssignmentForUpload) {
      setSelectedAssignmentId(selectedAssignmentForUpload.id);
    }
  }, [selectedAssignmentForUpload]);

  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  // Handle mock file pick
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toUpperCase() as
      | 'PDF'
      | 'DOCX'
      | 'PPTX'
      | 'JPG'
      | 'PNG';

    const allowedTypes = ['PDF', 'DOCX', 'PPTX', 'JPG', 'PNG'];
    if (!allowedTypes.includes(ext)) {
      setValidationError('Format file tidak didukung! Harap pilih PDF, DOCX, PPTX, JPG, atau PNG.');
      return;
    }

    setValidationError(null);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFile({
      name: file.name,
      size: `${sizeInMB} MB`,
      type: ext,
    });
  };

  // Mock template file sample for easy testing by child
  const handleSelectSampleFile = (type: 'PDF' | 'JPG') => {
    if (type === 'PDF') {
      setUploadedFile({
        name: `Tugas_${currentAssignment?.subject || 'Sekolah'}_${studentName.split(' ')[0]}.pdf`,
        size: '1.5 MB',
        type: 'PDF',
      });
    } else {
      setUploadedFile({
        name: `Foto_Lembar_Jawaban_${studentName.split(' ')[0]}.jpg`,
        size: '2.8 MB',
        type: 'JPG',
      });
    }
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAssignmentId || !currentAssignment) {
      setValidationError('Silakan pilih judul tugas terlebih dahulu.');
      return;
    }

    if (!uploadedFile) {
      setValidationError('Silakan unggah berkas tugas kamu (PDF, DOCX, PPTX, JPG, atau PNG).');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    // Compute Indonesian real-time timestamp
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const formattedDate = `${now.toLocaleDateString('id-ID', options)} WIB`;

    setTimeout(() => {
      setIsSubmitting(false);

      const submissionPayload: Omit<StudentSubmission, 'id'> = {
        assignmentId: currentAssignment.id,
        assignmentTitle: currentAssignment.title,
        subject: currentAssignment.subject,
        studentId: currentUser.id,
        studentName: studentName || currentUser.name,
        classGroup: classGroup || currentUser.classGroup,
        submittedAt: formattedDate,
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        fileType: uploadedFile.type,
        notes: studentNotes.trim(),
        submissionStatus: 'Tepat Waktu',
        gradingStatus: 'Menunggu Penilaian',
        score: null,
        teacherFeedback: '',
      };

      onSubmitHomework(submissionPayload);

      setLastSubmissionReceipt({
        studentName: studentName || currentUser.name,
        taskTitle: currentAssignment.title,
        subject: currentAssignment.subject,
        timeString: formattedDate,
        fileName: uploadedFile.name,
      });

      setShowSuccessModal(true);

      // Reset form
      setUploadedFile(null);
      setStudentNotes('');
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
          <Upload className="w-4 h-4" />
          <span>Pengumpulan Tugas Siswa</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
          Kumpulkan Tugas Sekolah
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Unggah foto hasil pekerjaan atau dokumen tugasmu untuk diperiksa dan dinilai oleh Bapak/Ibu Guru.
        </p>
      </div>

      {/* Main Submission Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Row: Student Name & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>Nama Lengkap Murid</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masukkan nama lengkap murid..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-sky-600" />
                <span>Kelas</span>
              </label>
              <select
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm font-semibold text-slate-800 cursor-pointer"
              >
                <option value="Kelas 5A">Kelas 5A - Wali Kelas: Bu Siti</option>
                <option value="Kelas 5B">Kelas 5B - Wali Kelas: Pak Budi</option>
                <option value="Kelas 4A">Kelas 4A</option>
                <option value="Kelas 6A">Kelas 6A</option>
              </select>
            </div>
          </div>

          {/* Select Assignment & Subject Preview */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Pilih Judul Tugas yang Dikumpulkan</span>
            </label>

            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm font-bold text-slate-900 cursor-pointer shadow-2xs"
            >
              {assignments.map((task) => (
                <option key={task.id} value={task.id}>
                  [{task.subject}] {task.title} (Batas: {task.dueDate})
                </option>
              ))}
            </select>

            {/* Selected Assignment Info Card */}
            {currentAssignment && (
              <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sky-800 uppercase px-2 py-0.5 rounded-md bg-white border border-sky-200">
                      Mata Pelajaran: {currentAssignment.subject}
                    </span>
                    <span className="text-slate-500">Guru: {currentAssignment.teacherName}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 italic">
                    "{currentAssignment.description}"
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-rose-700 font-bold bg-white px-3 py-1.5 rounded-lg border border-rose-100">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Batas: {currentAssignment.dueDate}</span>
                </div>
              </div>
            )}
          </div>

          {/* Kolom Keterangan / Catatan Murid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kolom Keterangan / Catatan untuk Guru (Opsional)
            </label>
            <textarea
              rows={3}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Tuliskan catatan pengerjaan tugasmu jika ada (contoh: 'Saya sudah menyertakan cara pengerjaan nomor 1-10 pada halaman 2')..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-slate-700 leading-relaxed"
            />
          </div>

          {/* Upload File Zone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>Upload Berkas Hasil Tugas</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Format didukung: PDF, DOCX, PPTX, JPG, PNG
              </span>
            </label>

            <div className="relative border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/30 hover:bg-sky-50/70 transition-all rounded-2xl p-6 sm:p-8 text-center">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {uploadedFile ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {uploadedFile.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Ukuran: {uploadedFile.size} · Format: {uploadedFile.type}
                  </div>
                  <div className="pt-2 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                      className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Ganti Berkas
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sky-700 text-sm sm:text-base hover:underline">
                      Klik untuk memilih file
                    </span>
                    <span className="text-slate-600 text-sm"> atau seret dokumen ke sini</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Foto hasil catatan di buku tulis atau dokumen tugas (Maksimal 25MB)
                  </p>

                  {/* Fast Simulation Helpers for Testing */}
                  <div className="pt-3 flex flex-wrap items-center justify-center gap-2 z-20">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1">
                      Contoh Cepat:
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSampleFile('PDF');
                      }}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-sky-700 hover:border-sky-300 transition-colors shadow-2xs cursor-pointer"
                    >
                      + Pakai Berkas PDF Latihan
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSampleFile('JPG');
                      }}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs cursor-pointer"
                    >
                      + Pakai Foto Lembar Jawaban (JPG)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Waktu pengumpulan akan tercatat secara otomatis saat menekan tombol di bawah.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Mengirimkan Tugas...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-5 h-5" />
                  <span>KUMPULKAN TUGAS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Notification Modal */}
      {showSuccessModal && lastSubmissionReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-100 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Hebat! Tugas Berhasil Dikumpulkan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Pekerjaanmu telah berhasil dikirim ke guru dan tercatat di sistem SMART CLASS.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/70 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-emerald-200/50 pb-1.5">
                <span className="text-emerald-800 font-semibold">Nama Murid:</span>
                <span className="font-bold text-slate-900">{lastSubmissionReceipt.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200/50 pb-1.5">
                <span className="text-emerald-800 font-semibold">Mata Pelajaran:</span>
                <span className="font-bold text-slate-900">{lastSubmissionReceipt.subject}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200/50 pb-1.5">
                <span className="text-emerald-800 font-semibold">Judul Tugas:</span>
                <span className="font-bold text-slate-900 max-w-[200px] truncate text-right">
                  {lastSubmissionReceipt.taskTitle}
                </span>
              </div>
              <div className="flex justify-between border-b border-emerald-200/50 pb-1.5">
                <span className="text-emerald-800 font-semibold">Berkas Terkirim:</span>
                <span className="font-bold text-slate-900">{lastSubmissionReceipt.fileName}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-emerald-800 font-semibold">Waktu Pengumpulan:</span>
                <span className="font-bold text-emerald-800">{lastSubmissionReceipt.timeString}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('data-murid');
                }}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Lihat di Data Tugas Murid</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('beranda');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
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
