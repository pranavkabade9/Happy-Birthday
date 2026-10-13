import React from 'react';
import { Gift, Calendar, Bell, Users, Settings as SettingsIcon, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'reminders' | 'all' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'reminders' | 'all' | 'settings') => void;
  onOpenAddModal: () => void;
  todayCount: number;
  upcomingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  todayCount,
  upcomingCount,
}) => {
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Title matching Finora aesthetic */}
            <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 font-bold text-2xl tracking-wider">
                🎂
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Family Birthdays</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Every birthday remembered, every wish ready
                </p>
              </div>
            </div>

            {/* Right Stat / Add Button */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Upcoming</span>
                <span className="text-sm font-bold text-emerald-400">{upcomingCount} Birthdays</span>
              </div>

              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Birthday</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2 pb-3 pt-1 border-t border-slate-800/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Dashboard</span>
              {todayCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full font-bold animate-pulse">
                  {todayCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'reminders'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Reminder Centre</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Birthdays</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar for Proper Mobile Compatibility */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0e1626]/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Gift className="w-5 h-5" />
            {todayCount > 0 && (
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>
          <span className="text-[10px] font-semibold">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'reminders' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Reminders</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'all' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-semibold">All</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'settings' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Settings</span>
        </button>
      </nav>
    </>
  );
};
