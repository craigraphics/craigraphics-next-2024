import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');

  return (
    <footer className="shadow-md ">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            className="text-accent dark:text-accent-dark hover:underline"
            href="https://github.com/craigraphics/craigraphics-next-2024"
            target="_blank"
          >
            <small>Designed and built by William Craig - {new Date().getFullYear()}</small>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
