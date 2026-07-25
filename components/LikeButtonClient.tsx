'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface LikeButtonClientProps {
  slug: string;
}

interface LikesResponse {
  likes: number;
  liked: boolean;
}

const localKey = (slug: string) => `liked_${slug}`;

function readLocalLiked(slug: string): boolean {
  try {
    return JSON.parse(localStorage.getItem(localKey(slug)) ?? 'false') === true;
  } catch {
    return false;
  }
}

const LikeButtonClient: React.FC<LikeButtonClientProps> = ({ slug }) => {
  const queryClient = useQueryClient();

  // Read after mount rather than during render: localStorage doesn't exist
  // during SSR, and seeding state from it would desync hydration.
  const [locallyLiked, setLocallyLiked] = React.useState(false);
  React.useEffect(() => setLocallyLiked(readLocalLiked(slug)), [slug]);

  const { data, isPending, isError } = useQuery<LikesResponse>({
    queryKey: ['likes', slug],
    queryFn: async () => {
      const response = await fetch(`/api/likes?slug=${encodeURIComponent(slug)}`);
      if (!response.ok) throw new Error(`Failed to load likes (${response.status})`);
      return response.json();
    },
    retry: 1,
    staleTime: 60_000,
  });

  const likeMutation = useMutation<LikesResponse>({
    mutationFn: async () => {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (!response.ok) throw new Error(`Failed to save like (${response.status})`);
      return response.json();
    },
    onSuccess: result => {
      queryClient.setQueryData(['likes', slug], result);
      setLocallyLiked(true);
      try {
        localStorage.setItem(localKey(slug), 'true');
      } catch {
        // Private browsing or a full quota — the server-side guard still holds.
      }
    },
  });

  // The server dedupes by address too, so a reader who cleared localStorage
  // still sees their like reflected.
  const liked = locallyLiked || data?.liked === true;
  const unavailable = isError || likeMutation.isError;
  const likeCount = data?.likes;

  const handleLike = () => {
    if (!liked && !unavailable) likeMutation.mutate();
  };

  const label = unavailable
    ? 'Likes are temporarily unavailable'
    : liked
      ? `Liked, ${likeCount ?? 0} likes`
      : `Like this post, ${likeCount ?? 0} likes`;

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-1 duration-300 transition-colors ${
        liked ? 'text-secondary' : 'text-foreground'
      } ${unavailable ? 'opacity-50' : ''}`}
      disabled={liked || isPending || unavailable || likeMutation.isPending}
      aria-label={label}
      title={unavailable ? label : undefined}
    >
      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      {/* No count rather than a misleading 0 when the store is unreachable. */}
      {typeof likeCount === 'number' && <span>{likeCount}</span>}
    </button>
  );
};

export default LikeButtonClient;
