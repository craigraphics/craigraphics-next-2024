import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(req: Request) {
  console.log('API route hit - Starting email send process');

  // Check if API key is set
  const apiKey = process.env.sendGridAPIKey;
  if (!apiKey) {
    console.error('SendGrid API key is missing');
    return NextResponse.json({ message: 'SendGrid configuration error' }, { status: 500 });
  }

  sgMail.setApiKey(apiKey);

  try {
    // Log the request body
    const body = await req.json();
    console.log('Request body:', body);

    // Check if required environment variables exist
    if (!process.env.toMail || !process.env.fromMail) {
      console.error('Missing required email configuration:', {
        toMail: !!process.env.toMail,
        fromMail: !!process.env.fromMail,
      });
      return NextResponse.json({ message: 'Email configuration error' }, { status: 500 });
    }

    // Construct email message
    const msg = {
      to: process.env.toMail,
      from: process.env.fromMail,
      subject: 'New Message from craigraphics.com',
      text: `From: ${body.email}\nMessage: ${body.message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${body.email}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
      `,
    };

    console.log('Attempting to send email with config:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
    });

    // Send the email
    const response = await sgMail.send(msg);

    // Log the SendGrid response
    console.log('SendGrid Response:', {
      statusCode: response[0].statusCode,
      headers: response[0].headers,
      body: response[0].body,
    });

    return NextResponse.json(
      {
        message: 'Email sent successfully',
        sendGridResponse: response[0].statusCode,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Detailed error information:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    if (error.response) {
      console.error('SendGrid Error Response:', {
        body: error.response.body,
        statusCode: error.response.statusCode,
        headers: error.response.headers,
      });
    }

    return NextResponse.json(
      {
        message: 'Error sending email',
        error: error.message,
        sendGridError: error.response?.body || 'No detailed error available',
      },
      { status: 500 }
    );
  }
}
