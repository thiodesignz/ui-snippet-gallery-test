import React, { useState } from 'react';
import SnippetGrid from '../components/SnippetGrid';
import FilterBar from '../components/FilterBar';
import { mockSnippets } from '../data/mockData';

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSnippets = mockSnippets.filter(snippet => {
    const matchesSearch = searchQuery === '' || 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => snippet.tags.includes(tag));
    
    return matchesSearch && matchesTags;
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
      
      <SnippetGrid snippets={filteredSnippets} />
    </div>
  );
}
