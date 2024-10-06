import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import ProgressBar from '@/components/ui/ProgressBar';
import Image from 'next/image';

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
    <div className="py-14 mt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto relative">
        <section className="mt-4">
          <Image src="/images/profile.png" alt="William Craig" width={200} height={200} className="rounded-full mx-auto mb-10" />
          <small className="text-xl mb-1 font-medium text-secondary dark:text-secondary-dark block">{t('greeting.hello')}</small>
          <h1 className="text-6xl sm:text-7xl font-bold text-primary dark:text-primary-dark mb-2">William Craig!</h1>
          <h2 className="text-3xl sm:text-4xl mb-2">{t('greeting.role')}</h2>
          <h2 className="text-2xl mb-2 text-secondary dark:text-secondary-dark">Fullstack, Frontend, UX</h2>
          <p className=" text-primary dark:text-primary-dark text-2xl font-medium">{t('greeting.title')}</p>
        </section>

        <hr className="border-t-1 border-primary dark:border-primary-dark border-dashed mt-14 mb-14 w-5/6"></hr>

        {/* About me section */}
        <h2 className="text-3xl font-extrabold text-primary dark:text-primary-dark sm:text-3xl underline-heading">{t('title')}</h2>
        <p className="mt-4 text-lg font-medium  ">{t('intro')}</p>

        {/* What I do section */}
        <section className="mt-14 lg:w-5/6">
          <h3 className="text-2xl font-bold text-primary dark:text-primary-dark underline-heading">{t('whatIDo')}</h3>
          <ul className="mt-4 space-y-0">
            {['fullStack', 'design', 'performance', 'problemSolving'].map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="flex-shrink-0 h-8 w-8 mr-3 text-secondary dark:text-secondary-dark" aria-hidden="true">
                  <Icon icon={whatIDoIcons[index]} width="28" height="28" />
                </span>
                <p className="text-lg font-light">
                  {t.rich(`skills.${item}`, {
                    em: chunks => <em className="text-secondary dark:text-secondary-dark">{chunks}</em>,
                  })}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* My Toolbox section */}
        <section className="mt-14 lg:w-5/6">
          <h3 className="text-2xl font-bold mb-4 text-primary dark:text-primary-dark underline-heading">{t('myToolbox')}</h3>
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
        </section>

        {/* Fun Facts section */}
        <section className="mt-14">
          <h3 className="text-2xl font-bold mb-4 text-primary dark:text-primary-dark underline-heading">{t('funFacts.title')}</h3>
          <ul className="mt-0 space-y-0">
            {['languages', 'power', 'music', 'hobby'].map((fact, index) => (
              <li key={index} className="flex items-center">
                <span className="flex-shrink-0 h-8 w-8 mr-3 text-secondary dark:text-secondary-dark" aria-hidden="true">
                  <Icon icon={funFactIcons[index]} width="28" height="28" />
                </span>
                <p className="text-base text-gray-700 dark:text-gray-300">{t(`funFacts.${fact}`)}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Connect section */}
        <section className="mt-14 lg:mt-0 ">
          <h3 className="text-2xl font-bold mb-4 text-primary dark:text-primary-dark underline-heading block lg:hidden">{t('connect')}</h3>
          <div
            className="mt-1 flex bottom-4  static flex-row  space-x-4
          lg:fixed lg:space-y-4 lg:space-x-0 lg:flex-col lg:bottom-14 lg:mb-4 lg:left-4"
          >
            <a href="https://github.com/craigraphics" target="_blank">
              <span className="sr-only">GitHub</span>
              <Icon icon="mdi:github" width="38" height="38" className="dark:text-foreground-dark dark:hover:text-secondary-dark" />
            </a>
            <a href="https://linkedin.com/in/willcraigz" target="_blank">
              <span className="sr-only">LinkedIn</span>
              <Icon icon="mdi:linkedin" width="38" height="38" className="dark:text-foreground-dark dark:hover:text-secondary-dark" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutMe;
