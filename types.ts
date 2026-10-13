export interface BirthdayMember {
  id: string;
  name: string;
  relationship: 'Uncle' | 'Aunty' | 'Dada' | 'Didi' | 'Other' | string;
  day: number;
  month: string; // e.g. "April", "January"
  monthIndex: number; // 0-11
  year?: number;
  customMessage?: string;
  assignedEmojis?: string;
}

export interface ReminderItem {
  id: string;
  memberId: string;
  memberName: string;
  relationship: string;
  reminderType: 'two_days_before' | 'birthday_day';
  reminderDate: Date; // Date object for this year's occurrence
  message: string;
  status: 'Scheduled' | 'Due Today' | 'Completed';
  acknowledged: boolean;
}

export interface AppSettings {
  enabled: boolean;
  reminderTime: string; // e.g. "09:00"
  twoDaysBeforeEnabled: boolean;
  birthdayDayEnabled: boolean;
  browserNotificationsEnabled: boolean;
}
