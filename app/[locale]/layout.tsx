import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Analytics } from '@vercel/analytics/react';
import '@/app/globals.css';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
  preload: true,
});

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  preload: true,
});

const validLocales = ['en', 'es'] as const;

export function generateStaticParams() {
  return validLocales.map(locale => ({ locale }));
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = await params.locale;
  const baseUrl = 'https://craigraphics.com';
  const url = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;
  const alternateUrls = {
    'en': baseUrl,
    'es': `${baseUrl}/es`,
  };

  return {
    title: {
      default: 'William Craig - Senior Software Engineer | Portfolio & Blog',
      template: '%s | William Craig',
    },
    description: 'Senior Software Engineer passionate about creating amazing web experiences. Portfolio, blog, and insights on web development, accessibility, and performance.',
    keywords: ['William Craig', 'Software Engineer', 'Web Developer', 'Frontend Developer', 'Full Stack Developer', 'Portfolio', 'Blog'],
    authors: [{ name: 'William Craig' }],
    creator: 'William Craig',
    publisher: 'William Craig',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        'en': alternateUrls.en,
        'es': alternateUrls.es,
        'x-default': alternateUrls.en,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      url: url,
      siteName: 'William Craig - Portfolio & Blog',
      title: 'William Craig - Senior Software Engineer | Portfolio & Blog',
      description: 'Senior Software Engineer passionate about creating amazing web experiences. Portfolio, blog, and insights on web development, accessibility, and performance.',
      images: [
        {
          url: `${baseUrl}/images/profile.png`,
          width: 200,
          height: 200,
          alt: 'William Craig',
        },
      ],
      alternateLocale: locale === 'en' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'William Craig - Senior Software Engineer | Portfolio & Blog',
      description: 'Senior Software Engineer passionate about creating amazing web experiences. Portfolio, blog, and insights on web development, accessibility, and performance.',
      images: [`${baseUrl}/images/profile.png`],
    },
    verification: {
      google: 'ya5cBfllEEWq8mqy2fudC48DhPfyusx-Ov0Aack1o2A',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const { children } = props;

  // Await the locale parameter
  const locale = await params.locale;

  // Validate locale after awaiting
  /* eslint-disable @typescript-eslint/no-explicit-any */
  if (!validLocales.includes(locale as any)) {
    notFound();
  }

  // Load messages
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
