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
    if (storedLiked) {
      setLiked(JSON.parse(storedLiked));
    }

    fetch(`/api/likes?slug=${slug}`)
      .then(response => response.json())
      .then(data => setLikeCount(data.likes));
  }, [slug]);

  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      localStorage.setItem(`liked_${slug}`, JSON.stringify(true));
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likes);
      }
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
