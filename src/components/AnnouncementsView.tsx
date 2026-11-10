import React, { useState } from 'react';
import {
  Announcement,
  UserProfile,
} from '../types';
import {
  Bell,
  Calendar,
  Pin,
  Plus,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Award,
  Clock,
  User,
  Trash2,
  X,
} from 'lucide-react';

interface AnnouncementsViewProps {
  currentUser: UserProfile;
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  currentUser,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
}) => {
  const isGuru = currentUser.role === 'guru';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<
    'Jadwal & Info' | 'Tugas Baru' | 'Ujian' | 'Kegiatan Sekolah' | 'Pengingat'
  >('Pengingat');
  const [newContent, setNewContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const categories = [
    'Semua',
    'Pengingat',
    'Tugas Baru',
    'Ujian',
    'Kegiatan Sekolah',
    'Jadwal & Info',
  ];

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort pinned first, then by date order
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    const dateStr = now.toLocaleDateString('id-ID', options);

    onAddAnnouncement({
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      author: currentUser.name,
      date: dateStr,
      pinned: isPinned,
    });

    // Reset
    setNewTitle('');
    setNewContent('');
    setIsPinned(false);
    setShowCreateModal(false);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Pengingat':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Ujian':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Tugas Baru':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Kegiatan Sekolah':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <Bell className="w-4 h-4" />
            <span>Papan Informasi & Pengumuman Sekolah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
            Pengumuman Guru & Sekolah
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Pusat informasi jadwal pembelajaran, ujian harian, kegiatan sekolah, dan pengingat tugas untuk murid.
          </p>
        </div>

        {isGuru && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman Baru</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata kunci pengumuman, judul, materi, atau penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden font-medium text-slate-700 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Kategori: {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <span className="text-slate-400 text-xs shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Tidak ada pengumuman yang sesuai
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Tidak ditemukan pengumuman dengan filter yang Anda gunakan.
            </p>
          </div>
        ) : (
          sortedAnnouncements.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-5 sm:p-6 transition-all border ${
                item.pinned
                  ? 'bg-gradient-to-r from-sky-50/60 via-white to-white border-sky-300 shadow-xs ring-1 ring-sky-200/50'
                  : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>

                  {item.pinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3 fill-sky-700" />
                      Disematkan
                    </span>
                  )}

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                </div>

                {isGuru && onDeleteAnnouncement && (
                  <button
                    onClick={() => {
                      if (confirm(`Hapus pengumuman "${item.title}"?`)) {
                        onDeleteAnnouncement(item.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Diumumkan oleh: <strong className="text-slate-800">{item.author}</strong></span>
                </div>
                <span className="text-[11px] font-semibold text-sky-600">
                  SD Smart Nusantara
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Buat Pengumuman Baru (Guru) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Buat Pengumuman Baru
                  </h3>
                  <span className="text-xs text-slate-500">
                    Kirim informasi penting kepada seluruh murid
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
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Pengingat Ujian Harian Tema 5 IPA Besok Pagi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kategori Informasi
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-hidden focus:border-sky-500"
                >
                  <option value="Pengingat">Pengingat (Deadline/Tugas)</option>
                  <option value="Tugas Baru">Tugas Baru</option>
                  <option value="Ujian">Ujian & Ulangan Harian</option>
                  <option value="Kegiatan Sekolah">Kegiatan Sekolah & Ekstrakurikuler</option>
                  <option value="Jadwal & Info">Jadwal & Informasi Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Isi Pesan Pengumuman
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tuliskan isi pengumuman lengkap untuk anak-anak..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin-check"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="pin-check" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Sematkan di bagian paling atas (Prioritas Tinggi)
                </label>
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
                  <Bell className="w-4 h-4" />
                  <span>Terbitkan Pengumuman</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
