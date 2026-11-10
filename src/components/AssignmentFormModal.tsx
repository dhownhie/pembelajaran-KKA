import React, { useState, useEffect } from 'react';
import { Assignment, Subject } from '../types';
import {
  X,
  FileCheck2,
  Calendar,
  Clock,
  BookOpen,
  User,
  Paperclip,
  CheckCircle2,
} from 'lucide-react';

interface AssignmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: Omit<Assignment, 'id'>, editId?: string) => void;
  initialData?: Assignment | null;
  teacherName: string;
}

export const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  teacherName,
}) => {
  const [subject, setSubject] = useState<Subject>('Matematika');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classGroup, setClassGroup] = useState('Kelas 5A');
  const [dueDateStr, setDueDateStr] = useState('15 Nov 2026, 17:00 WIB');
  const [attachmentName, setAttachmentName] = useState('');
  const [maxScore, setMaxScore] = useState(100);

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setClassGroup(initialData.classGroup);
      setDueDateStr(initialData.dueDate);
      setAttachmentName(initialData.attachmentName || '');
      setMaxScore(initialData.maxScore || 100);
    } else {
      setSubject('Matematika');
      setTitle('');
      setDescription('');
      setClassGroup('Kelas 5A');
      setDueDateStr('18 Nov 2026, 17:00 WIB');
      setAttachmentName('Lembar_Latihan_Tugas.pdf');
      setMaxScore(100);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    const assignedDateStr = now.toLocaleDateString('id-ID', options);

    const payload: Omit<Assignment, 'id'> = {
      subject,
      title: title.trim(),
      description: description.trim(),
      teacherName: initialData?.teacherName || teacherName,
      classGroup,
      assignedDate: initialData?.assignedDate || assignedDateStr,
      dueDate: dueDateStr.trim(),
      rawDueDate: '2026-11-18T17:00:00',
      attachmentName: attachmentName.trim() || undefined,
      attachmentSize: attachmentName ? '1.2 MB' : undefined,
      maxScore: Number(maxScore) || 100,
    };

    onSubmit(payload, initialData?.id);
    onClose();
  };

  const subjectsList: Subject[] = [
    'Matematika',
    'IPA',
    'Bahasa Indonesia',
    'Pendidikan Pancasila',
    'Seni Budaya & Prakarya',
    'PJOK',
    'Pendidikan Agama Islam',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-sky-100 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {initialData ? 'Edit Tugas Sekolah' : 'Buat Tugas Baru untuk Murid'}
              </h3>
              <span className="text-xs text-slate-500">
                Informasi tugas ini akan langsung tampil di akun seluruh murid.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mata Pelajaran
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-sky-500"
              >
                {subjectsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kelas Sasaran
              </label>
              <select
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-sky-500"
              >
                <option value="Kelas 5A">Kelas 5A</option>
                <option value="Kelas 5B">Kelas 5B</option>
                <option value="Kelas 4A">Kelas 4A</option>
                <option value="Kelas 6A">Kelas 6A</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Tugas
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Latihan Soal Cerita Operasi Hitung Campuran..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi & Petunjuk Pengerjaan
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan nomor halaman buku, cara pengerjaan, dan format pengumpulan..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>Batas Waktu Pengumpulan</span>
              </label>
              <input
                type="text"
                required
                value={dueDateStr}
                onChange={(e) => setDueDateStr(e.target.value)}
                placeholder="Contoh: 15 Nov 2026, 17:00 WIB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-sky-500" />
                <span>Nama Lampiran Dokumen (Opsional)</span>
              </label>
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="Contoh: Lembar_Kerja_Matematika.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialData ? 'Perbarui Tugas' : 'Publikasikan Tugas'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
