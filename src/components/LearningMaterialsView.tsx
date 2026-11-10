import React, { useState } from 'react';
import {
  LearningMaterial,
  Subject,
  UserProfile,
} from '../types';
import {
  Library,
  BookOpen,
  FileText,
  Video,
  ExternalLink,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  X,
  CheckCircle2,
  Sparkles,
  School,
} from 'lucide-react';
import { STUDY_CARD_IMAGE } from '../data/initialData';

interface LearningMaterialsViewProps {
  currentUser: UserProfile;
  materials: LearningMaterial[];
  onAddMaterial: (material: Omit<LearningMaterial, 'id'>) => void;
}

export const LearningMaterialsView: React.FC<LearningMaterialsViewProps> = ({
  currentUser,
  materials,
  onAddMaterial,
}) => {
  const isGuru = currentUser.role === 'guru';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [readingMaterial, setReadingMaterial] = useState<LearningMaterial | null>(null);

  // Form state
  const [newSubject, setNewSubject] = useState<Subject>('IPA');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<'PDF' | 'Video' | 'Modul' | 'Tautan'>('PDF');
  const [newFileName, setNewFileName] = useState('');

  const subjectsList = [
    'Semua',
    'Matematika',
    'IPA',
    'Bahasa Indonesia',
    'Pendidikan Pancasila',
    'Seni Budaya & Prakarya',
    'PJOK',
  ];

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      selectedSubject === 'Semua' || item.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    const dateStr = now.toLocaleDateString('id-ID', options);

    onAddMaterial({
      subject: newSubject,
      title: newTitle.trim(),
      description: newDescription.trim(),
      author: currentUser.name,
      classGroup: currentUser.classGroup || 'Kelas 5A',
      type: newType,
      fileName: newFileName.trim() || `${newTitle.trim().replace(/\s+/g, '_')}.${newType.toLowerCase()}`,
      fileSize: '2.5 MB',
      date: dateStr,
    });

    setNewTitle('');
    setNewDescription('');
    setNewFileName('');
    setShowCreateModal(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="w-4 h-4 text-rose-600" />;
      case 'PDF':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'Modul':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      default:
        return <ExternalLink className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <Library className="w-4 h-4" />
            <span>Pustaka Belajar Mandiri</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
            Materi Pembelajaran
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Kumpulan modul pelajaran, ringkasan rumus, video sains interaktif, dan lembar kerja untuk murid SD.
          </p>
        </div>

        {isGuru && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Bagikan Materi Baru</span>
          </button>
        )}
      </div>

      {/* Hero Banner for Study Resource */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-md grid grid-cols-1 md:grid-cols-12 items-center">
        <div className="md:col-span-8 p-6 sm:p-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Merdeka Belajar SD Smart Class</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display leading-tight">
            Belajar Jadi Mudah & Menyenangkan!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 max-w-xl leading-relaxed">
            Akses materi kapan saja sebelum mengerjakan tugas. Kamu bisa membaca langsung di layar atau mengunduh dokumen modul untuk dipelajari bersama orang tua di rumah.
          </p>
        </div>
        <div className="hidden md:block md:col-span-4 p-4">
          <img
            src={STUDY_CARD_IMAGE}
            alt="Ilustrasi Murid Belajar Sains dan Matematika"
            className="w-full h-36 object-cover rounded-xl shadow-md border-2 border-white/20"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari materi berdasarkan judul, rangkuman, atau nama guru pengampu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden font-medium text-slate-700 cursor-pointer"
            >
              <option value="Semua">Semua Mata Pelajaran</option>
              {subjectsList.slice(1).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick subject pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <span className="text-slate-400 text-xs shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Mata Pelajaran:
          </span>
          {subjectsList.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedSubject === s
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-sky-50 text-sky-700 border border-sky-100">
                  {item.subject}
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                  {getTypeIcon(item.type)}
                  <span>{item.type}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pengampu: <strong className="text-slate-800">{item.author}</strong></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.date}</span>
                  </div>
                  {item.fileSize && (
                    <span className="text-[11px] font-bold text-slate-600">{item.fileSize}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                onClick={() => setReadingMaterial(item)}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Baca Materi</span>
              </button>

              <button
                onClick={() => {
                  alert(`Mengunduh berkas materi "${item.fileName}" ke perangkat Anda.`);
                }}
                className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Unduh Berkas Materi"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Unduh</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reading/Viewer Modal */}
      {readingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-sky-100 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase">
                    {readingMaterial.subject} · {readingMaterial.type}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {readingMaterial.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setReadingMaterial(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 text-xs sm:text-sm text-slate-700 space-y-2">
                <div className="font-bold text-sky-900">Rangkuman Pembelajaran:</div>
                <p className="leading-relaxed">{readingMaterial.description}</p>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-sky-100">
                  <span>Guru: {readingMaterial.author}</span>
                  <span>Diunggah pada: {readingMaterial.date}</span>
                </div>
              </div>

              {/* Simulated Reader Frame */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-2xs border border-slate-200 mx-auto flex items-center justify-center text-sky-600">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {readingMaterial.fileName}
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pratinjau digital modul aktif. Untuk membaca lengkap secara offline tanpa kuota internet, silakan klik tombol Unduh Berkas di bawah ini.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      alert(`Mengunduh berkas lengkap: ${readingMaterial.fileName}`);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Dokumen Lengkap ({readingMaterial.fileSize || '2.5 MB'})</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setReadingMaterial(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Materi Baru (Guru) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Bagikan Materi Belajar Baru
                  </h3>
                  <span className="text-xs text-slate-500">
                    Unggah bahan ajar untuk dipelajari murid
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mata Pelajaran
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white"
                  >
                    {subjectsList.slice(1).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Format Materi
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white"
                  >
                    <option value="PDF">Dokumen PDF</option>
                    <option value="Modul">Modul Ringkasan</option>
                    <option value="Video">Video Edukasi</option>
                    <option value="Tautan">Tautan Web</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Materi Pembelajaran
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Rangkuman Cepat Siklus Air dan Pelestarian Lingkungan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deskripsi & Petunjuk Belajar
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Jelaskan ringkasan isi materi dan apa yang harus dipelajari siswa..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Berkas / Tautan Materi
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Contoh: Modul_IPA_Siklus_Air_Kelas5.pdf"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan & Bagikan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
