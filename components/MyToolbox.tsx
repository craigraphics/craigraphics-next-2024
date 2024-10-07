import { useTranslations } from 'next-intl';
import ProgressBar from '@/components/ui/ProgressBar';

const colors = ['bg-blue-600', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

const MyToolBox = () => {
  const t = useTranslations('about');

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
  );
};

export default MyToolBox;
