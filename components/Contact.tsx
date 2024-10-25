'use client';

import React, { useState, FormEvent, FC } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailFormData {
  email: string;
  message: string;
}

interface EmailResponse {
  message: string;
  sendGridResponse?: number;
  messageId?: string;
}

const sendEmail = async (formData: EmailFormData): Promise<EmailResponse> => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
};

const EmailForm: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const mutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      setEmail('');
      setMessage('');
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ email, message });
  };

  return (
    <div className="max-w-md mx-auto p-4 m-64">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="email">Please add the email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email@email.com"
          className="w-full p-2 border rounded !mt-1 !mb-4"
          disabled={mutation.isPending}
        />
        <Label htmlFor="message">Please add the message</Label>
        <Textarea
          name="message"
          id="message"
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Your message"
          className="w-full p-2 border rounded !mt-1"
          rows={4}
          disabled={mutation.isPending}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full p-2 rounded bg-accent text-background dark:bg-accent-dark dark:text-background-dark hover:bg-secondary dark:hover:bg-secondary-dark disabled:bg-gray-400"
        >
          {mutation.isPending ? 'Sending...' : 'Send'}
        </Button>

        {mutation.isSuccess && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">Email sent successfully!</div>}

        {mutation.isError && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {mutation.error instanceof Error ? mutation.error.message : 'Failed to send email. Please try again.'}
          </div>
        )}
      </form>
    </div>
  );
};

export default EmailForm;
