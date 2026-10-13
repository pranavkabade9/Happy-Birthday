import React, { useState } from 'react';
import { ReminderItem } from '../types';
import { Bell, Calendar, Clock, CheckCircle2, Copy, Check } from 'lucide-react';

interface RemindersViewProps {
  reminders: ReminderItem[];
  onAcknowledge: (reminderId: string) => void;
  onCopyWish: (message: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onAcknowledge,
  onCopyWish,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, message: string) => {
    onCopyWish(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeReminders = reminders.filter(r => r.status !== 'Completed' && !r.acknowledged);
  const completedReminders = reminders.filter(r => r.status === 'Completed' || r.acknowledged);

  return (
    <div className="space-y-8 pb-24 md:pb-16 bg-grid-pattern min-h-screen">
      
      {/* Header banner */}
      <div className="bg-gradient-to-r from-rose-900/40 via-pink-900/30 to-[#111827] border border-rose-500/30 p-8 rounded-3xl text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Birthday Reminder Centre</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Automated notifications 2 days before and on the actual birthday at 9:00 AM.
            </p>
          </div>
        </div>
      </div>

      {/* Active / Upcoming Reminders */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-500" />
          <span>Active & Scheduled Reminders ({activeReminders.length})</span>
        </h3>

        {activeReminders.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 p-8 rounded-3xl text-center shadow-lg">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-2" />
            <h4 className="text-base font-bold text-white">All reminders caught up!</h4>
            <p className="text-sm text-slate-400 mt-1">
              No pending active reminders right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReminders.map(rem => {
              const isCopied = copiedId === rem.id;
              const formattedDate = rem.reminderDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              });

              const isDueToday = rem.status === 'Due Today';

              return (
                <div
                  key={rem.id}
                  className={`bg-[#111827] border p-6 rounded-3xl transition-all flex flex-col justify-between shadow-lg ${
                    isDueToday
                      ? 'border-rose-500/60 bg-gradient-to-b from-rose-950/30 to-[#111827]'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                        {rem.relationship}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isDueToday ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isDueToday ? 'Due Today' : 'Scheduled'}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white">
                      {rem.memberName}&apos;s {rem.reminderType === 'two_days_before' ? '2-Day Alert' : 'Birthday Day'}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="mt-4 p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Message:</p>
                      <p className="text-sm font-bold text-slate-200">{rem.message}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onAcknowledge(rem.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                      Acknowledge
                    </button>

                    <button
                      onClick={() => handleCopy(rem.id, rem.message)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-xs transition-all ${
                        isCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
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
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h3 className="text-md font-bold text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Completed & Acknowledged ({completedReminders.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {completedReminders.map(rem => (
              <div
                key={rem.id}
                className="bg-[#111827] border border-slate-800 p-4 rounded-2xl opacity-75"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-400">{rem.relationship}</span>
                  <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Completed
                  </span>
                </div>
                <h5 className="font-bold text-sm text-white truncate">{rem.memberName}</h5>
                <p className="text-xs text-slate-400 mt-1 truncate">{rem.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
