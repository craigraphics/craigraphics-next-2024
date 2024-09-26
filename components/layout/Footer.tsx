import { Icon } from '@iconify/react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-gray-600 dark:text-gray-300">© {new Date().getFullYear()} Craigraphics. All rights reserved.</div>
          <div className="flex items-center">
            <a
              href="https://github.com/craigraphics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white ml-2 mr-2"
            >
              <Icon icon="simple-icons:github" className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/willcraigz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white ml-2 mr-2"
            >
              <Icon icon="simple-icons:linkedin" className="w-6 h-6" />
            </a>
            <a
              href="https://behance.net/willcraigz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white ml-2 mr-2"
            >
              <Icon icon="simple-icons:behance" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
