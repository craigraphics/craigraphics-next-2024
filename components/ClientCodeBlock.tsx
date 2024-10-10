// ClientCodeBlock.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import your AlternativeCodeBlock component for code blocks
const Codeblock = dynamic(() => import('./Codeblock'), { ssr: false });

interface ClientCodeBlockProps {
  children: string;
  className?: string;
}

const ClientCodeBlock: React.FC<ClientCodeBlockProps> = ({ children, className }) => {
  if (!className) {
    // Render inline code (for single backticks) as a <code> tag
    return <code className="bg-slate-900 !text-secondary-dark">{children}</code>;
  }

  // Render multi-line code blocks (for triple backticks) using Codeblock with syntax highlighting
  return <Codeblock className={className}>{children}</Codeblock>;
};

export default ClientCodeBlock;

//style={{ backgroundColor: 'rgb(1, 22, 39)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}
