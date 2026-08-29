'use client'

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function SafeMarkdown({ content }: { content: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // No servidor e no primeiro render do cliente, exibe apenas o texto puro para evitar mismatch no DOM
  if (!isMounted) {
    return <span className="line-clamp-4">{content}</span>;
  }

  return (
    <ReactMarkdown>
      {content}
    </ReactMarkdown>
  );
}