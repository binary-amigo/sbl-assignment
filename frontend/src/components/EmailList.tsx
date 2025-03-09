import React from 'react';
import { format } from 'date-fns';
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { EmailSchedule } from '../types/email';
import { useEmailStore } from '../store/emailStore';

interface EmailListProps {
  emails: EmailSchedule[];
}

export const EmailList: React.FC<EmailListProps> = ({ emails }) => {
  const setSelectedEmail = useEmailStore((state) => state.setSelectedEmail);

  const getStatusIcon = (status: EmailSchedule['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => setSelectedEmail(email)}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{email.subject}</h3>
                <p className="text-sm text-gray-500">{email.recipient}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {email.schedule_time 
  ? format(new Date(email.schedule_time), "MMM d, yyyy HH:mm 'UTC'") 
  : "Not scheduled"}

              </span>
              {getStatusIcon(email.status)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};