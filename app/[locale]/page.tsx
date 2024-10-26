import { unstable_setRequestLocale } from 'next-intl/server';
import AboutMe from '@/components/AboutMe';
import Layout from '@/components/layout/Layout';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return {
    title: 'Home Page - William Craig',
    description: 'Welcome to the Home Page of William Craig - craigraphics',
  };
}

export default async function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return (
    <Layout>
      <AboutMe />
    </Layout>
  );
}
