import React from 'react';
import { GraduationCap, School, Heart, BookOpen, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenLoginModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-12 py-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-100">
          {/* Col 1: Brand & School info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-slate-900 text-lg font-display tracking-tight">
                SMART CLASS SD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              Sistem Informasi Guru dan Murid untuk Sekolah Dasar. Menghubungkan guru, murid, dan orang tua dalam proses belajar yang menyenangkan dan terarah.
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <School className="w-4 h-4 text-sky-600 shrink-0" />
              <span>SD Smart Nusantara · Jl. Pendidikan Karakter No. 10</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Navigasi Cepat
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setActiveTab('beranda')}
                className="text-left text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
              >
                Halaman Beranda
              </button>
              <button
                onClick={() => setActiveTab('tugas')}
                className="text-left text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
              >
                Informasi Tugas
              </button>
              <button
                onClick={() => setActiveTab('kumpulkan')}
                className="text-left text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
              >
                Kumpulkan Tugas
              </button>
              <button
                onClick={() => setActiveTab('data-murid')}
                className="text-left text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
              >
                Data Tugas Murid
              </button>
              <button
                onClick={() => setActiveTab('pengumuman')}
                className="text-left text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
              >
                Pengumuman
              </button>
              <button
                onClick={() => setActiveTab('materi')}
                className="text-left text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
              >
                Materi Belajar
              </button>
            </div>
          </div>

          {/* Col 3: Mode Akun & Bantuan */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Pilihan Akun
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ingin mencoba fitur penilaian guru atau pengumpulan tugas murid?
            </p>
            <button
              onClick={onOpenLoginModal}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs border border-sky-200 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ganti Akun Guru / Murid</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © 2026 SISTEM INFORMASI GURU DAN MURID – SMART CLASS. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Pendidikan Sekolah Dasar Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
