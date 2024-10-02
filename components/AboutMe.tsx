import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import ProgressBar from '@/components/ui/ProgressBar';

const colors = ['bg-blue-600', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

const AboutMe = () => {
  const t = useTranslations('about');

  const whatIDoIcons = ['mdi:code-braces', 'mdi:palette', 'mdi:rocket-launch', 'mdi:account-group'];
  const funFactIcons = ['mdi:translate', 'mdi:coffee', 'mdi:music', 'mdi:table-tennis'];

  const skillData = [
    {
      name: t('toolbox.frontend.title'),
      value: 95,
      technologies: t.raw('toolbox.frontend.tools'),
    },
    {
      name: t('toolbox.backend.title'),
      value: 70,
      technologies: t.raw('toolbox.backend.tools'),
    },
    {
      name: t('toolbox.design.title'),
      value: 88,
      technologies: t.raw('toolbox.design.tools'),
    },
    {
      name: t('toolbox.devops.title'),
      value: 65,
      technologies: t.raw('toolbox.devops.tools'),
    },
    {
      name: t('toolbox.performance.title'),
      value: 85,
      technologies: t.raw('toolbox.performance.tools'),
    },
    {
      name: t('toolbox.build.title'),
      value: 80,
      technologies: t.raw('toolbox.build.tools'),
    },
    {
      name: t('toolbox.security.title'),
      value: 70,
      technologies: t.raw('toolbox.security.tools'),
    },
    {
      name: t('toolbox.mobile.title'),
      value: 40,
      technologies: t.raw('toolbox.mobile.tools'),
    },
  ];

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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('myToolbox')}</h3>
          <div className="grid grid-cols-1 gap-6">
            {skillData.map((skill, index) => (
              <ProgressBar
                key={index}
                value={skill.value}
                label={skill.name}
                color={colors[index % colors.length]}
                technologies={skill.technologies}
              />
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
          <div className="mt-4 flex space-x-6">
            <a href="https://github.com/craigraphics" target="_blank" className="text-gray-700 dark:text-gray-300 hover:text-gray-700">
              <span className="sr-only">GitHub</span>
              <Icon icon="mdi:github" width="40" height="40" />
            </a>
            <a href="https://linkedin.com/in/willcraigz" target="_blank" className="text-gray-700 dark:text-gray-300 hover:text-gray-700">
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
