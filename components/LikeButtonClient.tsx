'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface LikeButtonClientProps {
  slug: string;
}

const LikeButtonClient: React.FC<LikeButtonClientProps> = ({ slug }) => {
  const queryClient = useQueryClient();

  const { data: likeCount = 0 } = useQuery({
    queryKey: ['likes', slug],
    queryFn: () =>
      fetch(`/api/likes?slug=${slug}`)
        .then(res => res.json())
        .then(data => data.likes),
  });

  const { data: liked = false } = useQuery({
    queryKey: ['liked', slug],
    queryFn: () => {
      const storedLiked = localStorage.getItem(`liked_${slug}`);
      return storedLiked ? JSON.parse(storedLiked) : false;
    },
  });

  const likeMutation = useMutation({
    mutationFn: () =>
      fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      }).then(res => res.json()),
    onSuccess: data => {
      queryClient.setQueryData(['likes', slug], data.likes);
      queryClient.setQueryData(['liked', slug], true);
      localStorage.setItem(`liked_${slug}`, JSON.stringify(true));
    },
  });

  const handleLike = () => {
    if (!liked) {
      likeMutation.mutate();
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-1 duration-300 transition-colors ${
        liked ? 'text-secondary dark:text-secondary-dark' : 'text-foreground dark:text-foreground-dark'
      }`}
      disabled={liked || likeMutation.isPending}
    >
      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButtonClient;
