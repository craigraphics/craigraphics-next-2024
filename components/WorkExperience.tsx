'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import CompanySelector from '@/components/CompanySelector';

const WorkExperience = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const t = useTranslations('work');

  const companies = t.raw('companies');

  return (
    <div className="pt-14 mt-12 sm:max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold text-primary sm:text-3xl underline-heading mb-4">{t('title')}</h2>
      <p className="text-secondary text-lg font-medium mb-4">{t('description')}</p>
      <div className="flex flex-col sm:flex-row">
        <div className=" w-full sm:w-1/5 lg:pr-4 pt-6">
          <CompanySelector companies={companies} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="w-full sm:w-4/5">
          <Card className="border-none bg-transparent shadow-none">
            <CardContent className="pt-6 text-foreground border-none">
              <h3 className="text-xl font-semibold text-primary">{companies[activeTab].role}</h3>
              <p className="text-sm text-secondary">{companies[activeTab].period}</p>
              <p className="text-sm text-accent mb-4">{companies[activeTab].location}</p>
              <ul className="text-base text-foreground font-medium mb-4">
                {t.rich(`companies.${activeTab}.description`, {
                  li: chunks => (
                    <li className="mb-2">
                      <Icon icon="ph:caret-right" className="w-5 h-5 inline-block text-secondary" /> {chunks}
                    </li>
                  ),
                })}
              </ul>
              <ul className="flex flex-wrap gap-2 pt-4">
                {companies[activeTab].tags.map((tag: string, index: number) => (
                  <li key={index} className="text-xs bg-muted px-2 py-1 rounded text-primary">
                    {tag}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
