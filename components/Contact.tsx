'use client';

import React, { useState, useRef, FormEvent, FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useToast } from '@/hooks/use-toast';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';

interface EmailFormData {
  email: string;
  message: string;
  company: string; // honeypot — must stay empty for real users
  token: string; // Cloudflare Turnstile token
}

interface EmailResponse {
  message: string;
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
  const [company, setCompany] = useState<string>(''); // honeypot
  const [token, setToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileInstance>(null);
  const t = useTranslations('contact');
  const { toast } = useToast();

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const mutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      setEmail('');
      setMessage('');
      setCompany('');
      setToken('');
      turnstileRef.current?.reset();
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await mutation.mutateAsync({ email, message, company, token });

      toast({
        variant: 'success',
        description: t('form.success'),
        className: 'font-medium',
      });
    } catch {
      // token is single-use — reset so the user can retry
      setToken('');
      turnstileRef.current?.reset();

      toast({
        variant: 'error',
        description: t('form.error'),
        className: 'font-medium',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col content-center place-self-center py-14 mt-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-primary sm:text-3xl underline-heading mt-4">{t('title')}</h2>
      <p className="my-8 font-medium ">{t('description')}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="email">{t('form.email')} </Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          aria-required="true"
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
          aria-required="true"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={t('form.messagePlaceholder')}
          className="w-full p-2 border rounded !mt-1"
          rows={4}
          disabled={mutation.isPending}
        />

        {/* Honeypot: hidden from real users, off-screen (not display:none) to catch more bots */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
          <label htmlFor="company">Company</label>
          <input
            type="text"
            name="company"
            id="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
        </div>

        {siteKey && (
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            options={{ theme: 'auto', appearance: 'interaction-only', action: 'turnstile-spin-v2' }}
            onSuccess={setToken}
            onExpire={() => setToken('')}
            onError={() => setToken('')}
          />
        )}

        <Button
          type="submit"
          disabled={mutation.isPending || (!!siteKey && !token)}
          className="w-full p-2 rounded bg-accent text-background hover:bg-secondary disabled:bg-gray-400"
        >
          {mutation.isPending ? t('form.sending') : t('form.send')}
        </Button>

        <Toaster />
      </form>
    </div>
  );
};

export default EmailForm;
