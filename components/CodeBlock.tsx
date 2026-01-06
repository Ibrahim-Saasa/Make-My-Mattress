import React, { useState } from 'react';

interface CodeBlockProps {
  title: string;
  code: string;
  language: 'sql' | 'javascript' | 'json';
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-theme-border bg-theme-card/50 my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-theme-input/50 border-b border-theme-border">
        <span className="text-xs font-semibold text-theme-secondary uppercase tracking-wider">{title}</span>
        <button 
          onClick={copyToClipboard}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="text-sm leading-relaxed text-indigo-200">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;