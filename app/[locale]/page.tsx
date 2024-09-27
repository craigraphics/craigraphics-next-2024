import { unstable_setRequestLocale } from 'next-intl/server';
import AboutMe from '@/components/AboutMe';
import Layout from '@/components/layout/Layout';

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return (
    <Layout>
      <AboutMe />
    </Layout>
  );
}
