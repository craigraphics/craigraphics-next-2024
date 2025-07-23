import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // Check if required environment variables exist
    if (!process.env.TO_EMAIL || !process.env.FROM_EMAIL) {
      console.error('Missing required email configuration:', {
        toEmail: !!process.env.TO_EMAIL,
        fromEmail: !!process.env.FROM_EMAIL,
      });
      return NextResponse.json({ message: 'Email configuration error' }, { status: 500 });
    }

    // Construct email message
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [process.env.TO_EMAIL],
      subject: 'New Message from craigraphics.com',
      text: `From: ${body.email}\nMessage: ${body.message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${body.email}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
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
