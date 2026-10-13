import { BirthdayMember, ReminderItem } from '../types';
import { getBirthdayMessage } from './messageUtils';

export function getNextOccurrenceDate(day: number, monthIndex: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let year = today.getFullYear();
  let occurrence = new Date(year, monthIndex, day);
  occurrence.setHours(0, 0, 0, 0);

  // If this year's occurrence has already passed (yesterday or earlier), use next year
  if (occurrence < today) {
    occurrence = new Date(year + 1, monthIndex, day);
    occurrence.setHours(0, 0, 0, 0);
  }

  // Handle Feb 29 leap year edge cases gracefully if occurrence results in Mar 1 on non-leap years
  if (occurrence.getMonth() !== monthIndex) {
    // e.g. Feb 29 in non-leap year -> set to Feb 28
    occurrence = new Date(year + (occurrence < today ? 1 : 0), monthIndex, day === 29 ? 28 : day);
    occurrence.setHours(0, 0, 0, 0);
  }

  return occurrence;
}

export function getDaysUntil(occurrenceDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(occurrenceDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getCountdownLabel(days: number): string {
  if (days === 0) return 'Today! 🎉';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  if (days === -1) return 'Yesterday';
  return `${Math.abs(days)} days ago`;
}

export interface SortedMemberWithDetails extends BirthdayMember {
  nextOccurrence: Date;
  daysUntil: number;
}

export function getSortedBirthdays(members: BirthdayMember[]): SortedMemberWithDetails[] {
  const withDetails = members.map(m => {
    const nextOccurrence = getNextOccurrenceDate(m.day, m.monthIndex);
    const daysUntil = getDaysUntil(nextOccurrence);
    return {
      ...m,
      nextOccurrence,
      daysUntil
    };
  });

  return withDetails.sort((a, b) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime());
}

export function generateReminders(members: BirthdayMember[], reminderTimeStr: string = '09:00', twoDaysEnabled: boolean = true, dayEnabled: boolean = true): ReminderItem[] {
  const reminders: ReminderItem[] = [];
  const [hours, minutes] = reminderTimeStr.split(':').map(Number);

  members.forEach(member => {
    const nextOccur = getNextOccurrenceDate(member.day, member.monthIndex);
    const msg = getBirthdayMessage(member);

    // 1. Two days before reminder
    if (twoDaysEnabled) {
      const twoDaysBefore = new Date(nextOccur);
      twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
      twoDaysBefore.setHours(hours || 9, minutes || 0, 0, 0);

      const now = new Date();
      const diffDays = getDaysUntil(nextOccur);
      let status: 'Scheduled' | 'Due Today' | 'Completed' = 'Scheduled';

      // If today is exactly 2 days before
      if (diffDays === 2) {
        status = 'Due Today';
      } else if (diffDays < 2) {
        status = 'Completed';
      }

      reminders.push({
        id: `reminder-${member.id}-2days`,
        memberId: member.id,
        memberName: member.name,
        relationship: member.relationship,
        reminderType: 'two_days_before',
        reminderDate: twoDaysBefore,
        message: msg,
        status,
        acknowledged: false
      });
    }

    // 2. Birthday day reminder
    if (dayEnabled) {
      const dayOf = new Date(nextOccur);
      dayOf.setHours(hours || 9, minutes || 0, 0, 0);

      const diffDays = getDaysUntil(nextOccur);
      let status: 'Scheduled' | 'Due Today' | 'Completed' = 'Scheduled';

      if (diffDays === 0) {
        status = 'Due Today';
      } else if (diffDays < 0) {
        status = 'Completed';
      }

      reminders.push({
        id: `reminder-${member.id}-day`,
        memberId: member.id,
        memberName: member.name,
        relationship: member.relationship,
        reminderType: 'birthday_day',
        reminderDate: dayOf,
        message: msg,
        status,
        acknowledged: false
      });
    }
  });

  // Sort reminders by date ascending
  return reminders.sort((a, b) => a.reminderDate.getTime() - b.reminderDate.getTime());
}
