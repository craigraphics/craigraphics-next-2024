import { setRequestLocale } from 'next-intl/server';
import WorkExperience from '@/components/WorkExperience';
import ProjectShowcase from '@/components/ProjectShowcase';
import Layout from '@/components/layout/Layout';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);

  const baseUrl = 'https://craigraphics.com';
  const url = locale === 'en' ? `${baseUrl}/work` : `${baseUrl}/${locale}/work`;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const projects = messages.projects;

  return {
    title: 'Work',
    description: projects.description,
    openGraph: {
      title: projects.title,
      description: projects.description,
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
      title: projects.title,
      description: projects.description,
      images: [`${baseUrl}/images/profile.png`],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/work`,
        'es': `${baseUrl}/es/work`,
        'x-default': `${baseUrl}/work`,
      },
    },
  };
}

export default async function Project(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return (
    <Layout>
      <WorkExperience />
      <ProjectShowcase />
    </Layout>
  );
}
