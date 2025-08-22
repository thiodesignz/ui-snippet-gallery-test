import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              UI.Gallery
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search snippets..."
                className="w-64 border-0 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/upload">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
            </Link>
            <Link to="/profile/1">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
