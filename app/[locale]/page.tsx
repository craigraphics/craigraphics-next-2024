import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import Layout from '../../components/layout/Layout';

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const t = useTranslations('common');
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{t('welcome')}</h1>
      <p className="text-gray-600 dark:text-gray-300">This is the home page of your application. You can add more content here.</p>
    </Layout>
  );
}
