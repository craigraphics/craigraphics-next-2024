import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';

const AboutMe = () => {
  const t = useTranslations('about');

  const whatIDoIcons = ['mdi:code-braces', 'mdi:palette', 'mdi:rocket-launch', 'mdi:account-group'];
  const funFactIcons = ['mdi:translate', 'mdi:coffee', 'mdi:music', 'mdi:table-tennis'];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('greeting.hello')} William Craig! 👋</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t('greeting.title')}</p>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">{t('title')}</h2>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">{t('intro')}</p>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('whatIDo')}</h3>
          <ul className="mt-4 space-y-1">
            {['fullStack', 'design', 'performance', 'problemSolving'].map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="flex-shrink-0 h-8 w-8 mr-3 text-gray-600 dark:text-gray-300" aria-hidden="true">
                  <Icon icon={whatIDoIcons[index]} width="28" height="28" />
                </span>
                <p className="text-lg text-gray-700 dark:text-gray-300">{t(`skills.${item}`)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('myToolbox')}</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {['frontend', 'backend', 'design', 'devops'].map((category, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">{t(`toolbox.${category}.title`)}</h4>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{t(`toolbox.${category}.tools`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('funFacts.title')}</h3>
          <ul className="mt-4 space-y-1">
            {['languages', 'power', 'music', 'hobby'].map((fact, index) => (
              <li key={index} className="flex items-center">
                <span className="flex-shrink-0 h-8 w-8 text-gray-600 dark:text-gray-300 mr-3" aria-hidden="true">
                  <Icon icon={funFactIcons[index]} width="28" height="28" />
                </span>
                <p className="text-base text-gray-700 dark:text-gray-300">{t(`funFacts.${fact}`)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('connect')}</h3>
          <div className="mt-4 flex space-x-4">
            <a href="https://github.com/yourusername" className="text-gray-700 dark:text-gray-300 hover:text-gray-700">
              <span className="sr-only">GitHub</span>
              <Icon icon="mdi:github" width="40" height="40" />
            </a>
            <a href="https://linkedin.com/in/willcraigz" className="text-gray-700 dark:text-gray-300 hover:text-gray-700">
              <span className="sr-only">LinkedIn</span>
              <Icon icon="mdi:linkedin" width="40" height="40" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
