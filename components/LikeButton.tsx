'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  slug: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ slug }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const storedLiked = localStorage.getItem(`liked_${slug}`);
    const storedLikeCount = localStorage.getItem(`likeCount_${slug}`);

    if (storedLiked) {
      setLiked(JSON.parse(storedLiked));
    }

    if (storedLikeCount) {
      setLikeCount(parseInt(storedLikeCount, 10));
    }
  }, [slug]);

  const handleLike = () => {
    if (!liked) {
      const newLikeCount = likeCount + 1;
      setLiked(true);
      setLikeCount(newLikeCount);
      localStorage.setItem(`liked_${slug}`, JSON.stringify(true));
      localStorage.setItem(`likeCount_${slug}`, newLikeCount.toString());
    }
  };

  return (
    <button onClick={handleLike} className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500'}`} disabled={liked}>
      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
