import LikeButtonClient from './LikeButtonClient';

interface LikeButtonProps {
  slug: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ slug }) => {
  return <LikeButtonClient slug={slug} />;
};

export default LikeButton;
