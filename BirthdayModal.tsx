import React, { useState, useEffect } from 'react';
import { BirthdayMember } from '../types';
import { getBirthdayMessage, getMonthIndex } from '../utils/messageUtils';
import { X, Sparkles, User, Calendar, Heart } from 'lucide-react';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: BirthdayMember) => void;
  editingMember?: BirthdayMember | null;
}

export const BirthdayModal: React.FC<BirthdayModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMember,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<string>('Uncle');
  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<string>('January');
  const [year, setYear] = useState<string>('');
  const [customEmojis, setCustomEmojis] = useState<string>('🎂🎉😊');

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name);
      setRelationship(editingMember.relationship);
      setDay(editingMember.day);
      setMonth(editingMember.month);
      setYear(editingMember.year ? editingMember.year.toString() : '');
      setCustomEmojis(editingMember.assignedEmojis || '🎂🎉😊');
    } else {
      setName('');
      setRelationship('Uncle');
      setDay(1);
      setMonth('January');
      setYear('');
      setCustomEmojis('🎂🎉😊');
    }
  }, [editingMember, isOpen]);

  if (!isOpen) return null;

  const tempMember: BirthdayMember = {
    id: editingMember ? editingMember.id : Date.now().toString(),
    name: name || 'Family Member',
    relationship,
    day,
    month,
    monthIndex: getMonthIndex(month),
    year: year ? parseInt(year) : undefined,
    assignedEmojis: customEmojis
  };

  const previewMessage = getBirthdayMessage(tempMember);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: editingMember ? editingMember.id : Date.now().toString(),
      name: name.trim(),
      relationship,
      day: Number(day),
      month,
      monthIndex: getMonthIndex(month),
      year: year ? parseInt(year) : undefined,
      assignedEmojis: customEmojis
    });
    onClose();
  };

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {editingMember ? 'Edit Family Member' : 'Add Family Member'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-500" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Uncle or Priya Didi"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            />
          </div>

          {/* Relationship */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Relationship</span>
            </label>
            <select
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            >
              <option value="Uncle">Uncle</option>
              <option value="Aunty">Aunty</option>
              <option value="Dada">Dada</option>
              <option value="Didi">Didi</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Birthday Day & Month */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>Day (1-31)</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={31}
                value={day}
                onChange={e => setDay(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>Month</span>
              </label>
              <select
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              >
                {monthsList.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Birth Year & Emojis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Birth Year (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 1975"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Assigned Emojis
              </label>
              <input
                type="text"
                value={customEmojis}
                onChange={e => setCustomEmojis(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0a0f1d] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Live Wish Preview */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
              WhatsApp Wish Preview:
            </p>
            <p className="text-base font-bold text-white">
              {previewMessage}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-500/25 transition-all"
            >
              {editingMember ? 'Save Changes' : 'Save Member'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
