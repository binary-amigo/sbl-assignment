import { create } from 'zustand';
import { EmailSchedule } from '../types/email';

interface EmailStore {
  selectedEmail: EmailSchedule | null;
  setSelectedEmail: (email: EmailSchedule | null) => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  selectedEmail: null,
  setSelectedEmail: (email) => set({ selectedEmail: email }),
}));