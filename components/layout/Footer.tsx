import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');

  return (
    <footer className="shadow-md ">
      <div className="container mx-auto px-6 py-4">
        <div className="text-center">
          <a
            className="text-accent hover:underline"
            href="https://github.com/craigraphics/craigraphics-next-2024"
            target="_blank"
            rel="noopener noreferrer"
          >
            <small>
              {t('built')} - {new Date().getFullYear()}
            </small>
            <span className="sr-only"> (View source on GitHub, opens in new tab)</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
