import { BirthdayMember } from '../types';

// Preloaded specific messages mapping by name/id to ensure 100% adherence to exact rules & unique emojis
const PRELOADED_MESSAGES: Record<string, string> = {
  'Anita Aunty': 'Happy Birthday Aunty 🎂💐🥰',
  'Omkar Dada': 'Happy Birthday Omkar Dada 🎉🎁😊',
  'Sanju Uncle': 'Happy Birthday Uncle 🥳🎂✨',
  'Neha Didi': 'Happy Birthday Neha Didi 🌸🎂💖',
  'Shiv Dada': 'Happy Birthday Shiv Dada 🎊🎈😄',
  'Mrityunjay Uncle': 'Happy Birthday Uncle 🎂🙏🌟',
  'Ashwin Dada': 'Happy Birthday Ashwin Dada 🎁🎉🤗',
  'Sarita Aunty': 'Happy Birthday Aunty 💐🌷😊',
  'Viru Uncle': 'Happy Birthday Uncle 🎂🎊😇',
  'Sunita Aunty': 'Happy Birthday Aunty 🌹🎉🥰',
  'Shewta Didi': 'Happy Birthday Shewta Didi 🎂🦋💝',
  'Nandu Dada': 'Happy Birthday Nandu Dada 🎈🎂😎',
};

export function getBirthdayMessage(member: BirthdayMember): string {
  // If user provided a custom message
  if (member.customMessage && member.customMessage.trim() !== '') {
    return member.customMessage;
  }

  // Check preloaded exact messages
  if (PRELOADED_MESSAGES[member.name]) {
    return PRELOADED_MESSAGES[member.name];
  }

  // Fallback / dynamic generation for newly added members based on rules
  const rel = (member.relationship || '').toLowerCase();
  const firstName = member.name.split(' ')[0] || member.name;
  const emojis = member.assignedEmojis || '🎂🎉😊';

  if (rel.includes('uncle')) {
    return `Happy Birthday Uncle ${emojis}`;
  } else if (rel.includes('aunty') || rel.includes('aunt')) {
    return `Happy Birthday Aunty ${emojis}`;
  } else if (rel.includes('dada')) {
    return `Happy Birthday ${firstName} Dada ${emojis}`;
  } else if (rel.includes('didi')) {
    return `Happy Birthday ${firstName} Didi ${emojis}`;
  } else {
    return `Happy Birthday ${member.name} ${emojis}`;
  }
}

export function getMonthIndex(monthName: string): number {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const idx = months.indexOf(monthName.toLowerCase().trim());
  return idx >= 0 ? idx : 0;
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex] || 'January';
}
