import { unstable_setRequestLocale } from 'next-intl/server';
import Contact from '@/components/Contact';
import Layout from '@/components/layout/Layout';
import ClientProvider from '@/components/ClientProvider';

export async function generateMetadata() {
  return {
    title: 'Contact - William Craig',
    description: 'Welcome to the Contact Page of William Craig - craigraphics',
  };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <ClientProvider>
      <Layout>
        <Contact />
      </Layout>
    </ClientProvider>
  );
}
