import React, { useState } from 'react';
import { BirthdayMember } from '../types';
import { getSortedBirthdays, getCountdownLabel } from '../utils/dateUtils';
import { getBirthdayMessage } from '../utils/messageUtils';
import { Gift, Calendar, Users, Bell, Copy, Check, Sparkles, Heart } from 'lucide-react';

interface DashboardProps {
  members: BirthdayMember[];
  onCopyWish: (message: string) => void;
  onNavigateToAll: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  members,
  onCopyWish,
  onNavigateToAll,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sortedMembers = getSortedBirthdays(members);
  const todayBirthdays = sortedMembers.filter(m => m.daysUntil === 0);
  const upcomingBirthdays = sortedMembers.filter(m => m.daysUntil > 0);
  const nextBirthday = sortedMembers[0];

  const handleCopy = (id: string, message: string) => {
    onCopyWish(message);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-16 bg-grid-pattern min-h-screen">
      
      {/* Summary Stat Cards matching Finora UI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Members */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Members</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-4">{members.length}</h3>
        </div>

        {/* Birthdays Today */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-3xl shadow-lg flex flex-col justify-between relative overflow-hidden">
          {todayBirthdays.length > 0 && (
            <div className="absolute top-0 right-0 w-2 h-full bg-rose-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today</span>
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-rose-400 mt-4">{todayBirthdays.length}</h3>
        </div>

        {/* Upcoming Count */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Upcoming</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-4">{upcomingBirthdays.length}</h3>
        </div>

        {/* Next Birthday */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-3xl shadow-lg flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Birthday</span>
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-base font-bold text-white truncate">
              {nextBirthday ? nextBirthday.name : 'None'}
            </h4>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              {nextBirthday ? `${nextBirthday.day} ${nextBirthday.month} (${getCountdownLabel(nextBirthday.daysUntil)})` : ''}
            </p>
          </div>
        </div>

      </div>

      {/* Today's Birthday Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-lg font-bold text-white tracking-tight">Happening Today</h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            {todayBirthdays.length} {todayBirthdays.length === 1 ? 'Celebration' : 'Celebrations'}
          </span>
        </div>

        {todayBirthdays.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 p-8 rounded-3xl text-center shadow-lg">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-800/80 flex items-center justify-center text-rose-400 shadow-inner">
              <Heart className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white">No birthdays today</h3>
            <p className="text-sm text-slate-400 mt-1">
              You&apos;re all caught up! 🎉 Check out upcoming family birthdays below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayBirthdays.map(member => {
              const message = getBirthdayMessage(member);
              const isCopied = copiedId === member.id;

              return (
                <div
                  key={member.id}
                  className="bg-gradient-to-br from-[#131b2e] via-[#111827] to-[#1f1624] border border-rose-500/40 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                        {member.relationship} • Birthday Today! 🎉
                      </span>
                      <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-slate-300 font-medium mt-0.5">
                        {member.day} {member.month}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-[#0a0f1d] p-4 rounded-2xl border border-slate-800">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">WhatsApp Wish Ready:</p>
                    <p className="text-base sm:text-lg font-bold text-emerald-400 tracking-wide">{message}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-end">
                    <button
                      onClick={() => handleCopy(member.id, message)}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                        isCopied
                          ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Birthday Wish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming Birthdays Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-white tracking-tight">Upcoming Family Birthdays</h2>
          </div>
          <button
            onClick={onNavigateToAll}
            className="text-xs font-semibold text-rose-400 hover:underline"
          >
            View All ({members.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMembers.map(member => {
            const message = getBirthdayMessage(member);
            const isCopied = copiedId === member.id;
            const isSoon = member.daysUntil > 0 && member.daysUntil <= 2;

            return (
              <div
                key={member.id}
                className={`bg-[#111827] border p-6 rounded-3xl transition-all duration-200 flex flex-col justify-between shadow-lg ${
                  isSoon
                    ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/20 to-[#111827]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
                      {member.relationship}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      member.daysUntil === 0
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isSoon
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {getCountdownLabel(member.daysUntil)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-sm font-medium text-slate-400 mt-0.5">
                    {member.day} {member.month}
                  </p>

                  <div className="mt-4 p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Wish:</p>
                    <p className="text-sm font-bold text-slate-200">{message}</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Bell className="w-3 h-3 text-rose-400" />
                    <span>Reminders Active</span>
                  </span>

                  <button
                    onClick={() => handleCopy(member.id, message)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-xs transition-all ${
                      isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Wish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
