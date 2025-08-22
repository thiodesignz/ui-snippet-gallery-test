import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const popularTags = [
  'Dashboard', 'Mobile App', 'Dark UI', 'Landing Page', 'E-commerce',
  'SaaS', 'Portfolio', 'Admin Panel', 'Card Design', 'Form Design'
];

interface FilterBarProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FilterBar({ selectedTags, onTagsChange, searchQuery, onSearchChange }: FilterBarProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    onTagsChange([]);
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {(selectedTags.length > 0 || searchQuery) && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center space-x-2">
              <X className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {selectedTags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge key={tag} variant="default" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 hover:text-red-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
