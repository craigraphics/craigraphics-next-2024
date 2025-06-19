'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { CodeXml, Server, Palette, Cloud, MonitorSpeaker, Layers, LucideIcon, Lightbulb } from 'lucide-react';

// Technology data organized by categories
const technologyData = {
  fullstack: {
    icon: Layers,
    color: 'text-green-500 dark:text-green-400',
    lineColor: 'bg-green-500',
    technologies: [
      'AI',
      'System Design',
      'Next.js',
      'Performance',
      'Security',
      'Scalability',
      'Logging',
      'Coaching',
      'Mentoring',
      'Testing',
    ],
    yearsKey: 'years.fivePlus',
  },
  frontend: {
    icon: CodeXml,
    color: 'text-blue-600 dark:text-blue-400',
    lineColor: 'bg-blue-600',
    technologies: ['React', 'TypeScript', 'Tailwind', 'Bundling', 'TansTack Query', 'HTML / CSS', 'Angular', 'State Management'],
    yearsKey: 'years.fifteenPlus',
  },
  design: {
    icon: Palette,
    color: 'text-pink-500 dark:text-pink-400',
    lineColor: 'bg-pink-500',
    technologies: ['Figma', 'Adobe XD', 'Photoshop', 'A11y', 'UI Design Library', 'High-Fi Mockups', 'Brand', 'Usability'],
    yearsKey: 'years.tenPlus',
  },
  devops: {
    icon: Cloud,
    color: 'text-indigo-500 dark:text-indigo-400',
    lineColor: 'bg-indigo-500',
    technologies: ['Vercel', 'AWS', 'Docker', 'Git', 'CI/CD', 'Monitoring', 'Infrastructure as Code', 'Auto Scaling'],
    yearsKey: 'years.threePlus',
  },
  mobile: {
    icon: MonitorSpeaker,
    color: 'text-yellow-500 dark:text-yellow-400',
    lineColor: 'bg-yellow-500',
    technologies: ['React Native', 'PWA', 'Responsive', 'Electron', 'App Store', 'Mobile UI/UX', 'Touch', 'Cross-Platform'],
    yearsKey: 'years.tenPlus',
  },
  backend: {
    icon: Server,
    color: 'text-purple-500 dark:text-purple-400',
    lineColor: 'bg-purple-500',
    technologies: ['Node.js', 'Express', 'Python', 'GraphQL', 'REST', 'PostgreSQL', 'MongoDB', 'MySQL', 'WordPress'],
    yearsKey: 'years.fivePlus',
  },
};

// Enhanced technology data with learning info
const detailedTechData: { [key: string]: { learned: string; projects: string[] } } = {
  AI: { learned: '2023', projects: ['Chatbots', 'AI Tools', 'Machine Learning'] },
  'System Design': { learned: '2017', projects: ['Scalable Architectures', 'High-Traffic Apps', 'Enterprise Solutions'] },
  Performance: { learned: '2012', projects: ['Optimization Projects', 'Speed Improvements', 'Web Vitals'] },
  Scalability: { learned: '2016', projects: ['High-Load Systems', 'Microservices', 'Cloud Architecture'] },
  Security: { learned: '2014', projects: ['OWASP Implementation', 'Authentication Systems', 'Secure APIs'] },
  Logging: { learned: '2018', projects: ['Application Monitoring', 'Performance Tracking', 'Error Logging'] },
  Coaching: { learned: '2019', projects: ['Team Leadership', 'Junior Developer Mentoring', 'Code Reviews'] },
  Mentoring: { learned: '2020', projects: ['Career Guidance', 'Technical Mentorship', 'Knowledge Transfer'] },
  Testing: { learned: '2015', projects: ['Unit Tests', 'Integration Tests', 'E2E Testing'] },
  React: { learned: '2018', projects: ['Autodesk', 'Frontier Communications', 'Craigraphics LLC'] },
  'Next.js': { learned: '2020', projects: ['Craigraphics LLC', 'Autodesk', 'Business Website'] },
  TypeScript: { learned: '2020', projects: ['Autodesk', 'Craigraphics LLC'] },
  Tailwind: { learned: '2021', projects: ['Autodesk', 'Craigraphics LLC'] },
  Bundling: { learned: '2021', projects: ['Webpack', 'Vite', 'Build Optimization'] },
  'TansTack Query': { learned: '2023', projects: ['Craigraphics LLC'] },
  'HTML / CSS': { learned: '2007', projects: ['Craigraphics LLC', 'Globant', 'Interalia'] },
  'State Management': { learned: '2015', projects: ['Single page applications'] },
  Angular: { learned: '2015', projects: ['Carnival Cruise v1', 'Personal projects'] },
  'Node.js': { learned: '2015', projects: ['API Development', 'Server Applications'] },
  Express: { learned: '2015', projects: ['REST APIs', 'Backend Services'] },
  Python: { learned: '2023', projects: ['Data Processing', 'Automation Scripts'] },
  REST: { learned: '2013', projects: ['API Integrations', 'Microservices'] },
  PostgreSQL: { learned: '2016', projects: ['Relational Databases', 'Complex Queries'] },
  MongoDB: { learned: '2016', projects: ['Document Stores', 'NoSQL Apps'] },
  WordPress: { learned: '2011', projects: ['Websites', 'Blogs', 'Business portals'] },
  MySQL: { learned: '2014', projects: ['Web Applications', 'Data Management', 'CMS websites'] },
  GraphQL: { learned: '2020', projects: ['Modern APIs', 'Data Fetching'] },
  Figma: { learned: '2020', projects: ['UI Design', 'Prototyping'] },
  'Adobe XD': { learned: '2010', projects: ['UX Design', 'Wireframes'] },
  Photoshop: { learned: '2008', projects: ['Visual Identity', 'Brand Assets'] },
  Accessibility: { learned: '2016', projects: ['WCAG Compliance', 'Inclusive Design', 'Screen Reader Testing'] },
  'UI Design Library': { learned: '2018', projects: ['Design Systems', 'Component Libraries', 'Style Guides'] },
  'High-Fi Mockups': { learned: '2015', projects: ['Pixel Perfect Designs', 'Interactive Prototypes', 'Client Presentations'] },
  Brand: { learned: '2010', projects: ['Visual Identity', 'Logo Design', 'Brand Guidelines'] },
  Usability: { learned: '2012', projects: ['UX Research', 'User Testing', 'Intuitive Interfaces'] },
  Vercel: { learned: '2022', projects: ['Next.js Deployments', 'Edge Functions'] },
  AWS: { learned: '2021', projects: ['Cloud Infrastructure', 'Serverless Apps'] },
  Docker: { learned: '2022', projects: ['Containerization', 'Development Environments'] },
  Git: { learned: '2011', projects: ['Version Control', 'Team Collaboration'] },
  'CI/CD': { learned: '2016', projects: ['Automated Pipelines', 'Continuous Deployment', 'GitHub Actions'] },
  Monitoring: { learned: '2018', projects: ['Application Performance', 'Error Tracking', 'Uptime Monitoring'] },
  'Infrastructure as Code': { learned: '2019', projects: ['Terraform Scripts', 'CloudFormation', 'Automated Provisioning'] },
  'Auto Scaling': { learned: '2019', projects: ['Load Balancing', 'Traffic Management', 'Cost Optimization'] },
  'React Native': { learned: '2022', projects: ['Mobile Apps', 'Cross-Platform'] },
  PWA: { learned: '2018', projects: ['Progressive Web Apps', 'Offline Features'] },
  Responsive: { learned: '2011', projects: ['Mobile-First Apps', 'Cross-Device UIs'] },
  Electron: { learned: '2019', projects: ['Desktop Apps', 'Cross-Platform Desktop'] },
  'Mobile UI/UX': { learned: '2014', projects: ['Touch Interfaces', 'Mobile Design Patterns', 'Native Feel'] },
  'App Store': { learned: '2019', projects: ['App Store Listings', 'Keyword Optimization', 'User Acquisition'] },
  'Cross-Platform': { learned: '2019', projects: ['Code Reusability', 'Multi-Platform Apps', 'Shared Components'] },
  Touch: { learned: '2013', projects: ['Gesture Controls', 'Mobile Interactions', 'Touch-Friendly Design'] },
};

interface TechnologyBadgeProps {
  tech: string;
  locale: 'en' | 'es';
}

const TechnologyBadge = ({ tech }: TechnologyBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('about.toolbox');
  const techData = detailedTechData[tech];

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Badge
        variant="secondary"
        className="cursor-pointer transition-all duration-300 px-3 py-1 text-sm bg-muted dark:bg-muted-dark text-muted-foreground dark:text-muted-foreground hover:bg-primary/10 dark:hover:bg-primary-dark/10 hover:text-primary dark:hover:text-primary-dark hover:scale-105"
      >
        {tech}
      </Badge>

      {/* Tooltip */}
      {isHovered && techData && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
          <div className="bg-card dark:bg-card border border-muted dark:border-muted-dark rounded-lg shadow-lg p-3 min-w-[200px] max-w-[280px]">
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-muted dark:border-t-muted-dark"></div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground dark:text-foreground-dark text-sm">{tech}</h4>
                <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                  {t('since')} {techData.learned}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground dark:text-foreground-dark mb-1">{t('usedIn')}</p>
                <div className="flex flex-wrap gap-1">
                  {techData.projects.slice(0, 2).map((project, index) => (
                    <span
                      key={index}
                      className="text-xs bg-muted/50 dark:bg-muted-dark/50 px-2 py-0.5 rounded text-muted-foreground dark:text-muted-foreground"
                    >
                      {project}
                    </span>
                  ))}
                  {techData.projects.length > 2 && (
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                      +{techData.projects.length - 2} {t('more')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface TechnologyCategoryProps {
  IconComponent: LucideIcon;
  iconColor: string;
  lineColor: string;
  title: string;
  technologies: string[];
  yearsKey: string;
  locale: 'en' | 'es';
}

const TechnologyCategory = ({ IconComponent, iconColor, lineColor, title, technologies, yearsKey, locale }: TechnologyCategoryProps) => {
  const t = useTranslations('about.toolbox');

  return (
    <div className="flex flex-col items-center space-y-4 group">
      {/* Icon */}
      <div className="relative">
        <IconComponent size={48} className={`${iconColor} transition-all duration-300 group-hover:scale-110`} />
      </div>

      {/* Category Title with Colored Line */}
      <div className="text-center">
        <h3 className="text-3xl font-extrabold text-primary dark:text-primary-dark sm:text-xl mb-2">{title}</h3>
        <div className={`w-12 h-0.5 ${lineColor} rounded-full mx-auto`}></div>
      </div>

      {/* Technologies with Tooltips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {technologies.map((tech, index) => (
          <TechnologyBadge key={index} tech={tech} locale={locale} />
        ))}
      </div>

      {/* Years Badge */}
      <Badge className="bg-accent dark:bg-accent-dark text-background dark:text-background-dark font-medium px-3 py-1">{t(yearsKey)}</Badge>
    </div>
  );
};

const TechStack = () => {
  const t = useTranslations('about');
  const tToolbox = useTranslations('about.toolbox');
  const locale = useTranslations('common')('home') === 'Home' ? 'en' : 'es';

  const categories = [
    {
      key: 'fullstack',
      IconComponent: technologyData.fullstack.icon,
      iconColor: technologyData.fullstack.color,
      lineColor: technologyData.fullstack.lineColor,
      technologies: technologyData.fullstack.technologies,
      yearsKey: technologyData.fullstack.yearsKey,
      title: tToolbox('fullstack.title'),
    },
    {
      key: 'frontend',
      IconComponent: technologyData.frontend.icon,
      iconColor: technologyData.frontend.color,
      lineColor: technologyData.frontend.lineColor,
      technologies: technologyData.frontend.technologies,
      yearsKey: technologyData.frontend.yearsKey,
      title: t('toolbox.frontend.title'),
    },

    {
      key: 'backend',
      IconComponent: technologyData.backend.icon,
      iconColor: technologyData.backend.color,
      lineColor: technologyData.backend.lineColor,
      technologies: technologyData.backend.technologies,
      yearsKey: technologyData.backend.yearsKey,
      title: t('toolbox.backend.title'),
    },
    {
      key: 'design',
      IconComponent: technologyData.design.icon,
      iconColor: technologyData.design.color,
      lineColor: technologyData.design.lineColor,
      technologies: technologyData.design.technologies,
      yearsKey: technologyData.design.yearsKey,
      title: t('toolbox.design.title'),
    },
    {
      key: 'devops',
      IconComponent: technologyData.devops.icon,
      iconColor: technologyData.devops.color,
      lineColor: technologyData.devops.lineColor,
      technologies: technologyData.devops.technologies,
      yearsKey: technologyData.devops.yearsKey,
      title: t('toolbox.devops.title'),
    },
    {
      key: 'mobile',
      IconComponent: technologyData.mobile.icon,
      iconColor: technologyData.mobile.color,
      lineColor: technologyData.mobile.lineColor,
      technologies: technologyData.mobile.technologies,
      yearsKey: technologyData.mobile.yearsKey,
      title: t('toolbox.mobile.title'),
    },
  ];

  return (
    <section className="mt-14 lg:w-full">
      {/* Header */}
      <div className=" mb-12">
        <h3 className="text-3xl font-bold text-primary dark:text-primary-dark underline-heading mb-4">{t('myToolbox')}</h3>
        <p className="mt-1 font-medium">{tToolbox('description')}</p>
      </div>

      {/* Technology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {categories.map(category => (
          <TechnologyCategory
            key={category.key}
            IconComponent={category.IconComponent}
            iconColor={category.iconColor}
            lineColor={category.lineColor}
            title={category.title}
            technologies={category.technologies}
            yearsKey={category.yearsKey}
            locale={locale as 'en' | 'es'}
          />
        ))}
      </div>

      {/* Note */}
      <div className="mt-10 mb-10 text-center">
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
          <Lightbulb className="inline-block mr-1 relative -top-1" />
          {tToolbox('hoverTip')}
        </p>
      </div>
    </section>
  );
};

export default TechStack;
