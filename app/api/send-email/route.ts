import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

async function verifyTurnstile(token: string, remoteip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('Turnstile secret key is missing');
    return false;
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteip ? { remoteip } : {}),
      }),
    });
    const outcome = (await res.json()) as { success: boolean };
    return outcome.success === true;
  } catch (err) {
    console.error('Turnstile verification request failed:', err);
    return false;
  }
}

export async function POST(req: Request) {
  console.log('API route hit - Starting email send process');

  // Check if API key is set
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Resend API key is missing');
    return NextResponse.json({ message: 'Resend configuration error' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    // Log the request body
    const body = await req.json();

    // Honeypot: real users never fill this hidden field. Bots do.
    // Silently accept (200) but drop the message so bots don't learn they were caught.
    if (typeof body.company === 'string' && body.company.trim() !== '') {
      console.warn('Honeypot triggered - dropping spam submission');
      return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    }

    // Basic input validation
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!email || !message) {
      return NextResponse.json({ message: 'Email and message are required' }, { status: 400 });
    }

    // Captcha verification (server-side enforcement — the client check is not enough)
    const token = typeof body.token === 'string' ? body.token : '';
    if (!token) {
      return NextResponse.json({ message: 'Captcha verification required' }, { status: 400 });
    }
    const remoteip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for');
    const captchaOk = await verifyTurnstile(token, remoteip);
    if (!captchaOk) {
      return NextResponse.json({ message: 'Captcha verification failed' }, { status: 400 });
    }

    // Check if required environment variables exist
    if (!process.env.TO_EMAIL || !process.env.FROM_EMAIL) {
      console.error('Missing required email configuration:', {
        toEmail: !!process.env.TO_EMAIL,
        fromEmail: !!process.env.FROM_EMAIL,
      });
      return NextResponse.json({ message: 'Email configuration error' }, { status: 500 });
    }

    // Construct email message
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [process.env.TO_EMAIL],
      subject: 'New Message from craigraphics.com',
      text: `From: ${email}\nMessage: ${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        {
          message: 'Error sending email',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Email sent successfully',
        messageId: data?.id,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Detailed error information:');
    console.error('Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        message: 'Error sending email',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
