import React, { useState } from 'react';
import { BirthdayMember } from '../types';
import { getSortedBirthdays, getCountdownLabel } from '../utils/dateUtils';
import { getBirthdayMessage } from '../utils/messageUtils';
import { Search, Filter, Plus, Edit2, Trash2, Copy, Check, Calendar, Users } from 'lucide-react';

interface AllBirthdaysViewProps {
  members: BirthdayMember[];
  onOpenAddModal: () => void;
  onOpenEditModal: (member: BirthdayMember) => void;
  onDeleteMember: (id: string) => void;
  onCopyWish: (message: string) => void;
}

export const AllBirthdaysView: React.FC<AllBirthdaysViewProps> = ({
  members,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteMember,
  onCopyWish,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'upcoming' | 'alpha' | 'calendar'>('upcoming');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, message: string) => {
    onCopyWish(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter members
  let filtered = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRel = relationshipFilter === 'All' || m.relationship.toLowerCase() === relationshipFilter.toLowerCase();
    return matchesSearch && matchesRel;
  });

  // Sort members
  if (sortBy === 'upcoming') {
    const sorted = getSortedBirthdays(filtered);
    filtered = sorted;
  } else if (sortBy === 'alpha') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'calendar') {
    filtered = [...filtered].sort((a, b) => {
      if (a.monthIndex !== b.monthIndex) return a.monthIndex - b.monthIndex;
      return a.day - b.day;
    });
  }

  return (
    <div className="space-y-6 pb-24 md:pb-16 bg-grid-pattern min-h-screen">
      
      {/* Top search & filter bar */}
      <div className="bg-[#111827] border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-500" />
              <span>All Family Birthdays ({members.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage family member records, view WhatsApp wishes, and edit or add details.
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Birthday</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search family member..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            />
          </div>

          {/* Relationship Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <select
              value={relationshipFilter}
              onChange={e => setRelationshipFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 appearance-none"
            >
              <option value="All">All Relationships</option>
              <option value="Uncle">Uncle</option>
              <option value="Aunty">Aunty</option>
              <option value="Dada">Dada</option>
              <option value="Didi">Didi</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 appearance-none"
            >
              <option value="upcoming">Sort by: Next Upcoming</option>
              <option value="calendar">Sort by: Calendar (Jan → Dec)</option>
              <option value="alpha">Sort by: Alphabetical Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Birthdays */}
      {filtered.length === 0 ? (
        <div className="bg-[#111827] border border-slate-800 p-12 rounded-3xl text-center shadow-lg">
          <Users className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white">No matching family members</h3>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your search query or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(member => {
            const message = getBirthdayMessage(member);
            const isCopied = copiedId === member.id;
            const daysUntil = (member as any).daysUntil ?? 0;

            return (
              <div
                key={member.id}
                className="bg-[#111827] border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                      {member.relationship}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold">
                      {getCountdownLabel(daysUntil)}
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditModal(member)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit member"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
                          onDeleteMember(member.id);
                        }
                      }}
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

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
      )}

    </div>
  );
};
