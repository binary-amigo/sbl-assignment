export interface EmailSchedule {
  id: string;
  subject: string;
  recipient: string;
  content: string;
  schedule_time: string;
  status: 'scheduled' | 'sent' | 'failed';
}

export interface CreateEmailSchedule {
  subject: string;
  recipient: string;
  content: string;
  schedule_time: string;
}

export interface SendEmailResponse {
  id: string;
  status: 'sent' | 'failed';
  message?: string;
}