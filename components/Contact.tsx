'use client';

import React, { useState, FormEvent, FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';

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
  const t = useTranslations('contact');
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      setEmail('');
      setMessage('');
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await mutation.mutateAsync({ email, message });

      toast({
        variant: 'success',
        description: t('form.success'),
        className: 'font-medium',
      });
    } catch (error) {
      toast({
        variant: 'error',
        description: t('form.error'),
        className: 'font-medium',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col content-center place-self-centerpy-14 mt-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-primary dark:text-primary-dark sm:text-3xl underline-heading mt-4">{t('title')}</h2>
      <p className="my-8 font-medium ">{t('description')}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="email">{t('form.email')} </Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t('form.emailPlaceholder')}
          className="w-full p-2 border rounded !mt-1 !mb-4"
          disabled={mutation.isPending}
        />
        <Label htmlFor="message">{t('form.message')}</Label>
        <Textarea
          name="message"
          id="message"
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={t('form.messagePlaceholder')}
          className="w-full p-2 border rounded !mt-1"
          rows={4}
          disabled={mutation.isPending}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full p-2 rounded bg-accent text-background dark:bg-accent-dark dark:text-background-dark hover:bg-secondary dark:hover:bg-secondary-dark disabled:bg-gray-400"
        >
          {mutation.isPending ? t('form.sending') : t('form.send')}
        </Button>

        <Toaster />
      </form>
    </div>
  );
};

export default EmailForm;
