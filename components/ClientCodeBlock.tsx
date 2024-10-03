'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Codeblock = dynamic(() => import('./Codeblock'), { ssr: false });

interface ClientCodeBlockProps {
  children: string;
  className?: string;
}

const ClientCodeBlock: React.FC<ClientCodeBlockProps> = ({ children, className }) => {
  return <Codeblock className={className}>{children}</Codeblock>;
};

export default ClientCodeBlock;
