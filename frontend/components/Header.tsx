import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, User, Search, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { isSignedIn, user, signOut } = useAuth();

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
            {isSignedIn ? (
              <>
                <Link to="/upload">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
