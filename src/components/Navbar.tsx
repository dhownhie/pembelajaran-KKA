import React, { useState } from 'react';
import {
  ActiveTab,
  UserProfile,
} from '../types';
import {
  BookOpen,
  Home,
  FileCheck2,
  Upload,
  Table,
  Bell,
  Library,
  User,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onSwitchRole: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  unreadCount = 2,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    guruOnly?: boolean;
    muridOnly?: boolean;
    badge?: number;
  }> = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'tugas', label: 'Informasi Tugas', icon: FileCheck2 },
    { id: 'kumpulkan', label: 'Kumpulkan Tugas', icon: Upload, muridOnly: true },
    { id: 'data-murid', label: 'Data Tugas Murid', icon: Table },
    { id: 'pengumuman', label: 'Pengumuman', icon: Bell, badge: unreadCount },
    { id: 'materi', label: 'Materi Pembelajaran', icon: Library },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const isGuru = currentUser.role === 'guru';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('beranda')}
              className="flex items-center gap-2.5 text-left group transition-transform focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-slate-900 text-lg sm:text-xl flex items-center gap-1.5 font-display">
                  SMART CLASS
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-sky-100 text-sky-700">
                    SD
                  </span>
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline -mt-0.5">
                  Sistem Informasi Guru & Murid
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                  {isActive && (
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action / Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Switch Role Button */}
            <button
              onClick={onSwitchRole}
              title={`Klik untuk berganti ke peran ${isGuru ? 'Murid' : 'Guru'}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-slate-700 hover:text-sky-700 transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Ganti Peran:</span>
              <span className={`px-1.5 py-0.5 rounded-sm text-[11px] font-bold ${
                isGuru ? 'bg-sky-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {isGuru ? 'GURU' : 'MURID'}
              </span>
            </button>

            {/* Profile Avatar Quick Link */}
            <button
              onClick={() => handleNavClick('profil')}
              className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full hover:bg-slate-100 transition-colors text-left"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-300 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  {currentUser.classGroup}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold ${
                    isGuru ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {currentUser.role.toUpperCase()}
                  </span>
                  <span>{currentUser.classGroup}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onSwitchRole}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1"
            >
              <ArrowRightLeft className="w-3 h-3" />
              Ganti ke {isGuru ? 'Murid' : 'Guru'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
                      {item.badge} Baru
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
