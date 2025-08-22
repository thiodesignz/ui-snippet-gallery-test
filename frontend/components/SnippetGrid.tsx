import React from 'react';
import SnippetCard from './SnippetCard';
import { Snippet } from '../types';

interface SnippetGridProps {
  snippets: Snippet[];
}

export default function SnippetGrid({ snippets }: SnippetGridProps) {
  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No snippets found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {snippets.map(snippet => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}
