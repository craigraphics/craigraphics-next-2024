import { unstable_setRequestLocale } from 'next-intl/server';
import AboutMe from '@/components/AboutMe';
import Layout from '@/components/layout/Layout';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  unstable_setRequestLocale(locale);

  return {
    title: 'Home Page - William Craig',
    description: 'Welcome to the Home Page of William Craig - craigraphics',
  };
}

export default async function Home(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  unstable_setRequestLocale(locale);

  return (
    <Layout>
      <AboutMe />
    </Layout>
  );
}
