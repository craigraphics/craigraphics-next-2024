import Header from './Header';
import Footer from './Footer';
import ChatWidget from '../ChatWidget';
import ClientProvider from '../ClientProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">{children}</main>
      <ClientProvider>
        <ChatWidget />
      </ClientProvider>
      <Footer />
    </div>
  );
};

export default Layout;
