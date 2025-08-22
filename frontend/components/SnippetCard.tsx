import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ExternalLink, User, Figma, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Snippet } from '../types';
import { mockUsers } from '../data/mockData';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const user = mockUsers.find(u => u.id === snippet.userId);
  const { toast } = useToast();

  const handleCopyToFigma = async () => {
    if (!snippet.figmaUrl) return;
    
    try {
      await navigator.clipboard.writeText(snippet.figmaUrl);
      toast({
        title: "Figma URL copied!",
        description: "You can now paste this design into your Figma workspace.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually from the detail page.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/snippet/${snippet.id}`}>
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={snippet.imageUrl}
            alt={snippet.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="mb-3">
          <Link to={`/snippet/${snippet.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
              {snippet.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{snippet.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {snippet.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {snippet.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{snippet.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${user?.id}`} className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{snippet.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{snippet.views}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {snippet.figmaUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center space-x-2 bg-purple-50 border-purple-200 hover:bg-purple-100"
              onClick={handleCopyToFigma}
            >
              <Figma className="h-3 w-3 text-purple-600" />
              <Copy className="h-3 w-3 text-purple-600" />
              <span className="text-purple-700">Copy to Figma</span>
            </Button>
          )}
          
          {snippet.plugUrl && (
            <a href={snippet.plugUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-2">
                <ExternalLink className="h-3 w-3" />
                <span>View Project</span>
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
