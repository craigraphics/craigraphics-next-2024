import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);

interface AlternativeCodeBlockProps {
  children: string;
  className?: string;
}

const AlternativeCodeBlock: React.FC<AlternativeCodeBlockProps> = ({ children, className }) => {
  const language = className ? className.replace(/language-/, '') : 'javascript';

  return (
    <SyntaxHighlighter
      language={language}
      style={nightOwl}
      customStyle={{
        padding: '2rem',
        borderRadius: '0.375rem',
        overflow: 'auto',
        fontSize: '0.875rem',
      }}
      wrapLines={true}
      wrapLongLines={true}
    >
      {children.trim()}
    </SyntaxHighlighter>
  );
};

export default AlternativeCodeBlock;
