import { unstable_setRequestLocale } from 'next-intl/server';
import WorkExperience from '@/components/WorkExperience';
import ProjectShowcase from '@/components/ProjectShowcase';
import Layout from '@/components/layout/Layout';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const { locale } = params;

  unstable_setRequestLocale(locale);

  return {
    title: 'Work Page - William Craig',
    description: 'Welcome to the Work Page of William Craig - craigraphics',
  };
}

export default async function Project(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const { locale } = params;

  unstable_setRequestLocale(locale);
  return (
    <Layout>
      <WorkExperience />
      <ProjectShowcase />
    </Layout>
  );
}
