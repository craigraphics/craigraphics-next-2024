import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextIntlDir: 'i18n',
  },
};

export default withNextIntl(nextConfig);
