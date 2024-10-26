import { unstable_setRequestLocale } from 'next-intl/server';
import WorkExperience from '@/components/WorkExperience';
import ProjectShowcase from '@/components/ProjectShowcase';
import Layout from '@/components/layout/Layout';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return {
    title: 'Work Page - William Craig',
    description: 'Welcome to the Work Page of William Craig - craigraphics',
  };
}

export default async function Project({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <Layout>
      <WorkExperience />
      <ProjectShowcase />
    </Layout>
  );
}
