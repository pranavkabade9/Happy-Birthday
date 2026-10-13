import React, { useState } from 'react';
import { AppSettings, BirthdayMember } from '../types';
import { Settings, Bell, Download, Upload, ShieldAlert, AlertTriangle, Send } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  members: BirthdayMember[];
  onImportData: (importedMembers: BirthdayMember[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  members,
  onImportData,
  onShowToast,
}) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const handleToggle = (key: keyof AppSettings) => {
    if (typeof settings[key] === 'boolean') {
      onUpdateSettings({
        ...settings,
        [key]: !settings[key]
      });
      onShowToast('Settings updated successfully!', 'success');
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({
      ...settings,
      reminderTime: e.target.value
    });
    onShowToast('Reminder time updated!', 'success');
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      onShowToast('Browser notifications are not supported in this browser.', 'error');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      if (result === 'granted') {
        onShowToast('Browser notifications enabled successfully! 🎉', 'success');
      } else {
        onShowToast('Notification permission denied or dismissed.', 'info');
      }
    } catch (err) {
      onShowToast('Failed to request notification permission.', 'error');
    }
  };

  const testNotification = () => {
    if (notificationPermission !== 'granted') {
      onShowToast('Please enable browser notifications first.', 'error');
      return;
    }

    new Notification('Family Birthday Reminder 🎂', {
      body: 'Test Reminder: Mrityunjay Uncle\'s birthday is coming up soon!',
      icon: '/vite.svg'
    });
    onShowToast('Test notification sent!', 'success');
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ members, settings }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `family_birthdays_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Backup exported successfully! 📁', 'success');
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = event => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.members)) {
            onImportData(parsed.members);
            if (parsed.settings) {
              onUpdateSettings(parsed.settings);
            }
            onShowToast('Birthdays imported successfully! 🎉', 'success');
          } else {
            onShowToast('Invalid backup file format.', 'error');
          }
        } catch (err) {
          onShowToast('Failed to parse backup JSON file.', 'error');
        }
      };
    }
  };

  return (
    <div className="space-y-8 pb-24 md:pb-16 max-w-4xl mx-auto bg-grid-pattern min-h-screen">
      
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 p-8 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Settings className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Reminder Settings & Backup</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Configure notification times, browser alerts, and data backup.
          </p>
        </div>
      </div>

      {/* Reminder Preferences */}
      <div className="bg-[#111827] border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-rose-500" />
          <span>Notification Schedule Preferences</span>
        </h3>

        <div className="space-y-5 divide-y divide-slate-800">
          
          {/* Master Enable */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-white">Enable Reminders</p>
              <p className="text-xs text-slate-400">Turn on or off all in-app birthday reminder alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={() => handleToggle('enabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Reminder Time */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-bold text-white">Daily Reminder Time</p>
              <p className="text-xs text-slate-400">Default notification time for alerts</p>
            </div>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={handleTimeChange}
              className="px-4 py-2 rounded-xl bg-[#0a0f1d] border border-slate-800 text-sm font-bold text-white"
            />
          </div>

          {/* 2 Days Before */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-bold text-white">Two Days Before Reminder</p>
              <p className="text-xs text-slate-400">Receive alert 2 days prior to birthday to prepare</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoDaysBeforeEnabled}
                onChange={() => handleToggle('twoDaysBeforeEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Birthday Day */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-bold text-white">Birthday Day Reminder</p>
              <p className="text-xs text-slate-400">Receive alert on the actual birthday morning</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.birthdayDayEnabled}
                onChange={() => handleToggle('birthdayDayEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

        </div>
      </div>

      {/* Browser Notifications */}
      <div className="bg-[#111827] border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span>Browser Notifications & Limitations</span>
        </h3>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-300 space-y-1">
            <p className="font-bold">Important Notice Regarding Closed-Browser Notifications:</p>
            <p>
              This is a frontend-first web application. In-app reminders and active browser notifications work when the website is open or running in a browser tab. Closed-browser background push notifications require a dedicated server worker and push subscription backend infrastructure.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div>
            <p className="font-bold text-white text-sm">Browser Permission Status</p>
            <p className="text-xs text-slate-400">Current status: <span className="font-semibold uppercase text-rose-400">{notificationPermission}</span></p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {notificationPermission !== 'granted' ? (
              <button
                onClick={requestNotificationPermission}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>Enable Notifications</span>
              </button>
            ) : (
              <button
                onClick={testNotification}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Test Notification</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Backup */}
      <div className="bg-[#111827] border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-rose-500" />
          <span>Data Backup & Synchronization</span>
        </h3>

        <p className="text-xs text-slate-400">
          All family birthdays are stored safely in your browser&apos;s local storage. You can export your data as a JSON backup file or restore from a previous backup.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={exportBackup}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all border border-slate-700"
          >
            <Download className="w-4 h-4 text-rose-400" />
            <span>Export Birthdays JSON</span>
          </button>

          <label className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border border-rose-500/30">
            <Upload className="w-4 h-4" />
            <span>Import Backup JSON</span>
            <input type="file" accept=".json" onChange={importBackup} className="hidden" />
          </label>
        </div>
      </div>

    </div>
  );
};
