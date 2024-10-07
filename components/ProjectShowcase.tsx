import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Icon } from '@iconify/react';

import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface ProjectData {
  title: string;
  description: string;
  image: string;
  tools: string[];
  githubLink?: string;
  liveLink?: string;
}

const ProjectShowcase = () => {
  const t = useTranslations('projects');
  const apps = t.raw('apps');

  return (
    <section>
      <div className="pt-14 mt-12 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-primary dark:text-primary-dark sm:text-3xl underline-heading mb-4">{t('title')}</h2>
        <p className="text-secondary dark:text-secondary-dark text-lg font-medium mb-4">{t('description')}</p>
      </div>
      <div className="pt-4 mt-4 max-w-2xl lg:max-w-5xl mx-auto">
        {apps.map((project: ProjectData) => (
          <Card key={project.title} className="w-full bg-transparent border-muted-dark overflow-hidden mb-14">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="relative h-64 lg:h-auto lg:w-1/2">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 lg:w-1/2">
                  <h3 className="text-2xl font-bold text-primary dark:text-primary-dark mb-2">{project.title}</h3>
                  <p className="text-secondary-foreground dark:text-secondary-foreground-dark mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="text-xs bg-muted dark:bg-muted-dark px-2 py-1 rounded text-primary dark:text-primary-dark"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80"
                      >
                        <Icon
                          icon="mdi:github"
                          width="24"
                          height="24"
                          className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80"
                        />
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80"
                      >
                        <ExternalLink size={24} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProjectShowcase;
