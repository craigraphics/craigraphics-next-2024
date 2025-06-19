import Header from './Header';
import Footer from './Footer';
import ChatWidget from '../ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  verification: {
    google: 'ya5cBfllEEWq8mqy2fudC48DhPfyusx-Ov0Aack1o2A',
  },
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">{children}</main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default Layout;
