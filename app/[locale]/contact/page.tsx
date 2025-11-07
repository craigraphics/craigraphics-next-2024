import { setRequestLocale } from 'next-intl/server';
import Contact from '@/components/Contact';
import Layout from '@/components/layout/Layout';
import ClientProvider from '@/components/ClientProvider';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const { locale } = params;
  setRequestLocale(locale);

  const baseUrl = 'https://craigraphics.com';
  const url = locale === 'en' ? `${baseUrl}/contact` : `${baseUrl}/${locale}/contact`;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const contact = messages.contact;

  return {
    title: 'Contact',
    description: contact.description,
    openGraph: {
      title: contact.title,
      description: contact.description,
      url: url,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/profile.png`,
          width: 200,
          height: 200,
          alt: 'William Craig',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: contact.title,
      description: contact.description,
      images: [`${baseUrl}/images/profile.png`],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/contact`,
        'es': `${baseUrl}/es/contact`,
        'x-default': `${baseUrl}/contact`,
      },
    },
  };
}

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return (
    <ClientProvider>
      <Layout>
        <Contact />
      </Layout>
    </ClientProvider>
  );
}
