import WorkExperience from '@/components/WorkExperience';
import ProjectShowcase from '@/components/ProjectShowcase';
import Layout from '@/components/layout/Layout';

interface ProjectData {
  title: string;
  description: string;
  image: string;
  tools: string[];
  githubLink?: string;
  liveLink?: string;
}
const projectData: ProjectData = {
  title: 'Halcyon Theme',
  description:
    'A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. Available on Visual Studio Marketplace, Package Control, Atom Package Manager, and npm.',
  image: '/path/to/halcyon-image.jpg',
  tools: ['VS Code', 'Sublime Text', 'Atom', 'iTerm2', 'Hyper'],
  githubLink: 'https://github.com/...',
  liveLink: 'https://marketplace.visualstudio.com/...',
};

export default function Project() {
  return (
    <Layout>
      <WorkExperience />
      <ProjectShowcase project={projectData} />
    </Layout>
  );
}
