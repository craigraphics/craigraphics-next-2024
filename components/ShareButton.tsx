'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface ShareButtonProps {
  title: string;
  url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, url }) => {
  const t = useTranslations('common');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(`Share this article:\n\nTitle: ${title}\nURL: ${url}`);
    }
  };

  return (
    <Button variant="ghost" className="hover:bg-primary dark:hover:bg-primary-dark" size="sm" onClick={handleShare}>
      <Share2 className="h-5 w-5 mr-2" />
      {t('share')}
    </Button>
  );
};

export default ShareButton;
