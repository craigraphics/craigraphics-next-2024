import { setRequestLocale } from 'next-intl/server';
import AboutMe from '@/components/AboutMe';
import Layout from '@/components/layout/Layout';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);

  const baseUrl = 'https://craigraphics.com';
  const url = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const about = messages.about;

  return {
    title: 'Home',
    description: `${about.greeting.role} - ${about.greeting.title}`,
    openGraph: {
      title: `William Craig - ${about.greeting.role}`,
      description: about.intro,
      url: url,
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
      title: `William Craig - ${about.greeting.role}`,
      description: about.intro,
      images: [`${baseUrl}/images/profile.png`],
    },
    alternates: {
      canonical: url,
      languages: {
        en: baseUrl,
        es: `${baseUrl}/es`,
        'x-default': baseUrl,
      },
    },
  };
}

export default async function Home(props: Props) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'William Craig',
    jobTitle: 'Senior Software Engineer',
    url: 'https://craigraphics.com',
    image: 'https://craigraphics.com/images/profile.png',
    sameAs: [
      'https://github.com/craigraphics',
      'https://linkedin.com/in/willcraigz',
      'https://behance.net/willcraigz',
      'https://instagram.com/willcrg',
    ],
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <AboutMe />
    </Layout>
  );
}
