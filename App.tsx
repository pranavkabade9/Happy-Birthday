import React, { useState, useEffect } from 'react';
import { BirthdayMember, AppSettings } from './types';
import { INITIAL_BIRTHDAYS } from './data/initialData';
import { generateReminders } from './utils/dateUtils';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { RemindersView } from './components/RemindersView';
import { AllBirthdaysView } from './components/AllBirthdaysView';
import { SettingsView } from './components/SettingsView';
import { BirthdayModal } from './components/BirthdayModal';
import { Toast } from './components/Toast';

export default function App() {
  // Load members from localStorage or initial preloaded list
  const [members, setMembers] = useState<BirthdayMember[]>(() => {
    try {
      const saved = localStorage.getItem('family_birthdays_members_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load members from localStorage', e);
    }
    return INITIAL_BIRTHDAYS;
  });

  // Load settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('family_birthdays_settings_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    return {
      enabled: true,
      reminderTime: '09:00',
      twoDaysBeforeEnabled: true,
      birthdayDayEnabled: true,
      browserNotificationsEnabled: false
    };
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'reminders' | 'all' | 'settings'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BirthdayMember | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Sync members & settings to localStorage
  useEffect(() => {
    localStorage.setItem('family_birthdays_members_v2', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('family_birthdays_settings_v2', JSON.stringify(settings));
  }, [settings]);

  // Generate reminders
  const reminders = React.useMemo(() => {
    if (!settings.enabled) return [];
    return generateReminders(
      members,
      settings.reminderTime,
      settings.twoDaysBeforeEnabled,
      settings.birthdayDayEnabled
    );
  }, [members, settings]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleCopyWish = async (message: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message);
        showToast('Birthday wish copied! 🎉', 'success');
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = message;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy');
          showToast('Birthday wish copied! 🎉', 'success');
        } catch (err) {
          showToast('Failed to copy to clipboard', 'error');
        }
        document.body.removeChild(textarea);
      }
    } catch (err) {
      showToast('Clipboard access denied or unsupported', 'error');
    }
  };

  const handleSaveMember = (member: BirthdayMember) => {
    const exists = members.some(m => m.id === member.id);
    if (exists) {
      setMembers(members.map(m => m.id === member.id ? member : m));
      showToast(`Updated ${member.name}'s birthday successfully!`, 'success');
    } else {
      setMembers([...members, member]);
      showToast(`Added ${member.name}'s birthday successfully! 🎉`, 'success');
    }
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    const memberToDelete = members.find(m => m.id === id);
    setMembers(members.filter(m => m.id !== id));
    showToast(`Removed ${memberToDelete?.name || 'member'} from records.`, 'info');
  };

  const handleAcknowledgeReminder = () => {
    showToast('Reminder marked as acknowledged.', 'success');
  };

  const handleImportData = (importedMembers: BirthdayMember[]) => {
    setMembers(importedMembers);
  };

  // Calculate today's and upcoming birthdays count for badges
  const todayCount = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return members.filter(m => {
      const d = new Date(today.getFullYear(), m.monthIndex, m.day);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    }).length;
  }, [members]);

  const upcomingCount = React.useMemo(() => {
    return members.length;
  }, [members]);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white">
      
      {/* Navigation Header & Mobile Bottom Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingMember(null);
          setIsAddModalOpen(true);
        }}
        todayCount={todayCount}
        upcomingCount={upcomingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            members={members}
            onCopyWish={handleCopyWish}
            onNavigateToAll={() => setActiveTab('all')}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersView
            reminders={reminders}
            onAcknowledge={handleAcknowledgeReminder}
            onCopyWish={handleCopyWish}
          />
        )}

        {activeTab === 'all' && (
          <AllBirthdaysView
            members={members}
            onOpenAddModal={() => {
              setEditingMember(null);
              setIsAddModalOpen(true);
            }}
            onOpenEditModal={member => {
              setEditingMember(member);
              setIsAddModalOpen(true);
            }}
            onDeleteMember={handleDeleteMember}
            onCopyWish={handleCopyWish}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            members={members}
            onImportData={handleImportData}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Add / Edit Birthday Modal */}
      <BirthdayModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        editingMember={editingMember}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type || 'success'}
          onClose={() => setToast(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#111827] border-t border-slate-800 py-6 mt-auto text-center text-xs text-slate-400 mb-16 md:mb-0">
        <p>Family Birthday Reminders &copy; {new Date().getFullYear()} &bull; Every birthday remembered, every wish ready.</p>
      </footer>

    </div>
  );
}
