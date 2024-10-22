'use client';

import React, { useState, FormEvent, FC } from 'react';

const EmailForm: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);

  const resetForm = () => {
    setEmail('');
    setMessage('');
  };

  const submitForm = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSuccess(true);
        setError(false);
        resetForm();
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setSuccess(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" />
      <textarea name="message" required value={message} onChange={e => setMessage(e.target.value)} placeholder="Your message" />
      <button type="submit" disabled={isSuccess}>
        Send
      </button>
      {isSuccess && <p>Email sent successfully!</p>}
      {isError && <p>Failed to send email. Please try again.</p>}
    </form>
  );
};

export default EmailForm;
