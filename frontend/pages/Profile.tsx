import React from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SnippetGrid from '../components/SnippetGrid';
import { mockUsers, mockSnippets } from '../data/mockData';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const user = mockUsers.find(u => u.id === userId);
  const userSnippets = mockSnippets.filter(s => s.userId === userId);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-gray-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">
              {userSnippets.length} snippet{userSnippets.length !== 1 ? 's' : ''} uploaded
            </p>
            {user.plugUrl && (
              <a href={user.plugUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Visit Portfolio</span>
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Snippets</h2>
      </div>
      
      {userSnippets.length > 0 ? (
        <SnippetGrid snippets={userSnippets} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No snippets uploaded yet</p>
        </div>
      )}
    </div>
  );
}
