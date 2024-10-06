'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

import Layout from '@/components/layout/Layout';

const WorkExperience = () => {
  const [activeTab, setActiveTab] = useState(1);
  const t = useTranslations('projects');

  const companies = t.raw('companies');

  interface Company {
    title: string;
    role: string;
    period: string;
    description: string;
    tags: string[];
  }

  return (
    <Layout>
      <div className="pt-14 mt-12 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-primary dark:text-primary-dark sm:text-3xl underline-heading mb-4">{t('title')}</h2>
        <p className="text-secondary dark:text-secondary-dark text-lg font-medium mb-4">{t('description')}</p>
        <div className="flex">
          <div className="w-1/5 pr-4 pt-6">
            {companies.map((company: Company, index: number) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`w-full text-left py-2 px-4 mb-2 font-medium transition
                ${
                  activeTab === index
                    ? 'dark:bg-background-dark border-primary border-l-2 dark:border-l-primary-dark dark:text-secondary-dark font-semibold'
                    : 'hover:bg-primary dark:hover:bg-primary-dark hover:text-background dark:hover:text-background-dark'
                }`}
              >
                {company.title}
              </button>
            ))}
          </div>
          <div className="w-4/5">
            <Card className="border-none bg-transparent shadow-none">
              <CardContent className="pt-6 text-foreground dark:text-foreground-dark border-none">
                <h3 className="text-xl font-semibold text-primary dark:text-primary-dark">{companies[activeTab].role}</h3>
                <p className="text-sm text-secondary dark:text-secondary-dark">{companies[activeTab].period}</p>
                <p className="text-sm text-accent dark:text-accent-dark mb-4">{companies[activeTab].location}</p>
                <ul className="text-sm dark:text-foreground-dark font-medium mb-4">
                  {t.rich(`companies.${activeTab}.description`, {
                    li: chunks => (
                      <li className="mb-2">
                        <Icon icon="ph:caret-right" className="w-5 h-5 inline-block text-secondary-dark" /> {chunks}
                      </li>
                    ),
                  })}
                </ul>
                <ul className="flex flex-wrap gap-2 pt-4">
                  {companies[activeTab].tags.map((tag: string, index: number) => (
                    <li key={index} className="text-xs bg-muted dark:bg-muted-dark px-2 py-1 rounded">
                      {tag}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkExperience;
