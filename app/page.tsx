import Layout from '../components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to Your Web App</h1>
      <p className="text-gray-600 dark:text-gray-300">This is the home page of your application. You can add more content here.</p>
    </Layout>
  );
}
