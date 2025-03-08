import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { EmailForm } from './components/EmailForm';
import { EmailList } from './components/EmailList';
import { CreateEmailSchedule, EmailSchedule, SendEmailResponse } from './types/email';
import axios from 'axios';

const queryClient = new QueryClient();

function EmailScheduler() {
  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: async (): Promise<EmailSchedule[]> => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/emails/logs`);
      return response.data;
    }
  });

  const scheduleMutation = useMutation({
    mutationFn: async (newEmail: CreateEmailSchedule) => {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/emails/schedule`, newEmail);
      return Promise.resolve({ ...newEmail, id: Date.now().toString(), status: 'scheduled' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    }
  });

  const sendNowMutation = useMutation({
    mutationFn: async (emailData: Omit<CreateEmailSchedule, 'schedule_time'>): Promise<SendEmailResponse> => {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/emails/send`, emailData);
      return Promise.resolve({ id: Date.now().toString(), status: 'sent' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Email Scheduler</h1>
          <p className="mt-2 text-sm text-gray-600">Schedule your emails to be sent at the perfect time</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Schedule New Email</h2>
          <EmailForm 
            onSubmit={(data) => scheduleMutation.mutate(data)}
            onSendNow={(data) => sendNowMutation.mutate(data)}
            isLoading={scheduleMutation.isPending}
            isSending={sendNowMutation.isPending}
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Scheduled Emails</h2>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <EmailList emails={emails} />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EmailScheduler />
    </QueryClientProvider>
  );
}

export default App;