import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SnippetGrid from '../components/SnippetGrid';
import FilterBar from '../components/FilterBar';
import { useBackend } from '../hooks/useBackend';

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const backend = useBackend();

  const { data: snippetsData, isLoading } = useQuery({
    queryKey: ['snippets', searchQuery, selectedTags.join(',')],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (searchQuery) params.search = searchQuery;
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');
      
      return backend.snippets.list(params);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Beautiful UI Snippets
        </h1>
        <p className="text-gray-600">
          Browse and get inspired by the latest UI designs from the community
        </p>
      </div>
      
      <FilterBar
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading snippets...</p>
        </div>
      ) : (
        <SnippetGrid snippets={snippetsData?.snippets || []} />
      )}
    </div>
  );
}
