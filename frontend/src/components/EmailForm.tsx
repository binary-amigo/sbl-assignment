import React, { useState } from 'react';
import { Send, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { CreateEmailSchedule } from '../types/email';

interface EmailFormProps {
  onSubmit: (data: CreateEmailSchedule) => void;
  onSendNow: (data: Omit<CreateEmailSchedule, 'schedule_time'>) => void;
  isLoading: boolean;
  isSending: boolean;
}

export const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, onSendNow, isLoading, isSending }) => {
  const [formData, setFormData] = useState<CreateEmailSchedule>({
    subject: '',
    recipient: '',
    content: '',
    schedule_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSendNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const { schedule_time, ...emailData } = formData;
    onSendNow(emailData);
  };  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Recipient</label>
        <input
          type="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.recipient}
          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Schedule Date</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="datetime-local"
            required
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
            value={formData.schedule_time}
            onChange={(e) => setFormData({ ...formData, schedule_time: e.target.value })}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            'Scheduling...'
          ) : (
            <>
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Email
            </>
          )}
        </button>
        <button
          onClick={handleSendNow}
          disabled={isSending}
          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isSending ? (
            'Sending...'
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Send Now
            </>
          )}
        </button>
      </div>
    </form>
  );
};