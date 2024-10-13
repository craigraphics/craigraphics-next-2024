import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'William Craig Portfolio & Blog',
    short_name: 'William Craig',
    description: "William Craig's Portfolio & Blog",
    start_url: '/',
    display: 'standalone',
    background_color: '#131C2B',
    theme_color: '#13A1D7',
    icons: [
      {
        src: '/images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
