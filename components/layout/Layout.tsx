import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';
import ClientProvider from '../ClientProvider';

const ChatWidget = dynamic(() => import('../ChatWidget'));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-grow container mx-auto px-6 py-8">{children}</main>
      <ClientProvider>
        <ChatWidget />
      </ClientProvider>
      <Footer />
    </div>
  );
};

export default Layout;
