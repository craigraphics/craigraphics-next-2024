'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { CodeXml, Server, Palette, Cloud, Layers, LucideIcon, Lightbulb, Sparkles } from 'lucide-react';

// Technology data organized by categories. Order here is the order rendered:
// AI first, then the architecture and infrastructure work, with the UI layers
// after it — matching where the day-to-day work actually sits now.
const technologyData = {
  ai: {
    icon: Sparkles,
    color: 'text-orange-500 dark:text-orange-400',
    lineColor: 'bg-orange-500',
    technologies: [
      'AI',
      'LLM Orchestration',
      'LLM Observability',
      'RAG',
      'Agentic Workflows',
      'MCP',
      'LiteLLM',
      'Prompt Engineering',
    ],
    yearsKey: 'years.threePlus',
  },
  fullstack: {
    icon: Layers,
    color: 'text-green-500 dark:text-green-400',
    lineColor: 'bg-green-500',
    technologies: [
      'System Design',
      'Scalability',
      'Security',
      'Performance',
      'Logging',
      'Testing',
      'Coaching',
      'Mentoring',
    ],
    yearsKey: 'years.tenPlus',
  },
  devops: {
    icon: Cloud,
    color: 'text-indigo-500 dark:text-indigo-400',
    lineColor: 'bg-indigo-500',
    technologies: ['AWS', 'Terraform', 'Datadog', 'Docker', 'CI/CD', 'Vercel', 'Git', 'Monitoring', 'Infrastructure as Code', 'Auto Scaling'],
    yearsKey: 'years.fivePlus',
  },
  frontend: {
    icon: CodeXml,
    color: 'text-blue-600 dark:text-blue-400',
    lineColor: 'bg-blue-600',
    technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Responsive', 'Bundling', 'TansTack Query', 'HTML / CSS', 'Angular', 'State Management'],
    yearsKey: 'years.fifteenPlus',
  },
  design: {
    icon: Palette,
    color: 'text-pink-500 dark:text-pink-400',
    lineColor: 'bg-pink-500',
    technologies: ['Figma', 'Adobe XD', 'Photoshop', 'A11y', 'UI Design Library', 'High-Fi Mockups', 'Brand', 'Usability'],
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
  AI: { learned: '2023', projects: ['Disney', 'SQOR.ai', 'Chatbots', 'AI Tools'] },
  'LLM Orchestration': { learned: '2025', projects: ['Disney', 'SQOR.ai', 'Multi-Model Routing', 'Fallbacks'] },
  'LLM Observability': { learned: '2025', projects: ['Disney', 'Token & Cost Tracking', 'Latency Monitoring', 'Alerting'] },
  RAG: { learned: '2024', projects: ['Disney', 'Knowledge Retrieval', 'Grounded Answers'] },
  'Agentic Workflows': { learned: '2024', projects: ['Disney', 'Felix', 'Multi-Agent Support Tools'] },
  MCP: { learned: '2025', projects: ['Disney', 'Felix', 'Datadog / Jira / GitHub Integrations'] },
  LiteLLM: { learned: '2025', projects: ['Disney', 'Multi-Provider Gateway', 'Usage Instrumentation'] },
  'Prompt Engineering': { learned: '2023', projects: ['Disney', 'SQOR.ai', 'Craigraphics Chatbot'] },
  'System Design': { learned: '2017', projects: ['Scalable Architectures', 'High-Traffic Apps', 'Enterprise Solutions'] },
  Performance: { learned: '2012', projects: ['Optimization Projects', 'Speed Improvements', 'Web Vitals'] },
  Scalability: { learned: '2016', projects: ['High-Load Systems', 'Microservices', 'Cloud Architecture'] },
  Security: { learned: '2014', projects: ['OWASP Implementation', 'Authentication Systems', 'Secure APIs'] },
  Logging: { learned: '2018', projects: ['Application Monitoring', 'Performance Tracking', 'Error Logging'] },
  Coaching: { learned: '2019', projects: ['Team Leadership', 'Junior Developer Mentoring', 'Code Reviews'] },
  Mentoring: { learned: '2020', projects: ['Career Guidance', 'Technical Mentorship', 'Knowledge Transfer'] },
  Testing: { learned: '2015', projects: ['Unit Tests', 'Integration Tests', 'E2E Testing'] },
  React: { learned: '2018', projects: ['Disney', 'Autodesk', 'Frontier Communications', 'Craigraphics LLC'] },
  'Next.js': { learned: '2020', projects: ['Disney', 'Craigraphics LLC', 'Autodesk', 'Business Website'] },
  TypeScript: { learned: '2020', projects: ['Disney', 'Autodesk', 'Craigraphics LLC'] },
  Tailwind: { learned: '2021', projects: ['Autodesk', 'Craigraphics LLC'] },
  Bundling: { learned: '2021', projects: ['Webpack', 'Vite', 'Build Optimization'] },
  'TansTack Query': { learned: '2023', projects: ['Craigraphics LLC'] },
  'HTML / CSS': { learned: '2007', projects: ['Craigraphics LLC', 'Globant', 'Interalia'] },
  'State Management': { learned: '2015', projects: ['Single page applications'] },
  Angular: { learned: '2015', projects: ['Carnival Cruise v1', 'Personal projects'] },
  'Node.js': { learned: '2015', projects: ['API Development', 'Server Applications'] },
  Express: { learned: '2015', projects: ['REST APIs', 'Backend Services'] },
  Python: { learned: '2023', projects: ['Disney', 'Data Processing', 'Automation Scripts'] },
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
  Terraform: { learned: '2025', projects: ['Disney', 'Infrastructure Provisioning', 'AI Platform Services'] },
  Datadog: { learned: '2025', projects: ['Disney', 'LLM Observability', 'APM & Monitors', 'Alerting'] },
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
}

const TechnologyBadge = ({ tech }: TechnologyBadgeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('about.toolbox');
  const techData = detailedTechData[tech];
  const tooltipId = `tooltip-${tech.replace(/[\s/]+/g, '-').toLowerCase()}`;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <Badge
        variant="secondary"
        tabIndex={0}
        role="button"
        aria-describedby={techData ? tooltipId : undefined}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-pointer transition-all duration-300 px-3 py-1 text-sm bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
      >
        {tech}
      </Badge>

      {/* Tooltip */}
      {isVisible && techData && (
        <div
          role="tooltip"
          id={tooltipId}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
        >
          <div className="bg-background border border-muted rounded-lg shadow-lg p-3 min-w-[200px] max-w-[280px]">
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-muted"></div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground text-sm">{tech}</h4>
                <span className="text-xs text-muted-foreground">
                  {t('since')} {techData.learned}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground mb-1">{t('usedIn')}</p>
                <div className="flex flex-wrap gap-1">
                  {techData.projects.slice(0, 2).map((project) => (
                    <span
                      key={project}
                      className="text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground"
                    >
                      {project}
                    </span>
                  ))}
                  {techData.projects.length > 2 && (
                    <span className="text-xs text-muted-foreground">
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
}

const TechnologyCategory = ({ IconComponent, iconColor, lineColor, title, technologies, yearsKey }: TechnologyCategoryProps) => {
  const t = useTranslations('about.toolbox');

  return (
    <div className="flex flex-col items-center space-y-4 group">
      {/* Icon */}
      <div className="relative">
        <IconComponent size={48} className={`${iconColor} transition-all duration-300 group-hover:scale-110`} />
      </div>

      {/* Category Title with Colored Line */}
      <div className="text-center">
        <h3 className="text-3xl font-extrabold text-primary sm:text-xl mb-2">{title}</h3>
        <div className={`w-12 h-0.5 ${lineColor} rounded-full mx-auto`}></div>
      </div>

      {/* Technologies with Tooltips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {technologies.map((tech) => (
          <TechnologyBadge key={tech} tech={tech} />
        ))}
      </div>

      {/* Years Badge */}
      <Badge className="bg-accent text-background font-medium px-3 py-1">{t(yearsKey)}</Badge>
    </div>
  );
};

const TechStack = () => {
  const t = useTranslations('about');
  const tToolbox = useTranslations('about.toolbox');

  const categories = [
    {
      key: 'ai',
      IconComponent: technologyData.ai.icon,
      iconColor: technologyData.ai.color,
      lineColor: technologyData.ai.lineColor,
      technologies: technologyData.ai.technologies,
      yearsKey: technologyData.ai.yearsKey,
      title: tToolbox('ai.title'),
    },
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
      key: 'devops',
      IconComponent: technologyData.devops.icon,
      iconColor: technologyData.devops.color,
      lineColor: technologyData.devops.lineColor,
      technologies: technologyData.devops.technologies,
      yearsKey: technologyData.devops.yearsKey,
      title: t('toolbox.devops.title'),
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
      key: 'frontend',
      IconComponent: technologyData.frontend.icon,
      iconColor: technologyData.frontend.color,
      lineColor: technologyData.frontend.lineColor,
      technologies: technologyData.frontend.technologies,
      yearsKey: technologyData.frontend.yearsKey,
      title: t('toolbox.frontend.title'),
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
  ];

  return (
    <section className="mt-14 lg:w-full">
      {/* Header */}
      <div className=" mb-12">
        <h3 className="text-3xl font-bold text-primary underline-heading mb-4">{t('myToolbox')}</h3>
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
          />
        ))}
      </div>

      {/* Note */}
      <div className="mt-10 mb-10 text-center">
        <p className="text-sm text-muted-foreground">
          <Lightbulb className="inline-block mr-1 relative -top-1" />
          {tToolbox('hoverTip')}
        </p>
      </div>
    </section>
  );
};

export default TechStack;
