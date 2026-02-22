import Link from 'next/link';

interface NavLinkProps {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, onClick, children }) => {
  return (
    <Link
      href={href}
      className="block py-2 font-medium text-secondary hover:text-primary transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
