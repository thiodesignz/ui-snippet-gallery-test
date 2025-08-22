import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Eye, ExternalLink, User, Calendar, Figma, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../hooks/useAuth';
import { useBackend } from '../hooks/useBackend';

export default function SnippetDetail() {
  const { id } = useParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const backend = useBackend();
  const queryClient = useQueryClient();

  const { data: snippet, isLoading } = useQuery({
    queryKey: ['snippet', id],
    queryFn: () => backend.snippets.get({ id: id! }),
    enabled: !!id,
  });

  const { data: user } = useQuery({
    queryKey: ['user', snippet?.userId],
    queryFn: () => backend.users.getById({ id: snippet!.userId }),
    enabled: !!snippet?.userId,
  });

  const { data: likeStatus } = useQuery({
    queryKey: ['likeStatus', id],
    queryFn: () => backend.snippets.getLikeStatus({ id: id! }),
    enabled: !!id && isSignedIn,
  });

  const likeMutation = useMutation({
    mutationFn: () => backend.snippets.like({ id: id! }),
    onSuccess: (data) => {
      queryClient.setQueryData(['likeStatus', id], { liked: data.liked });
      queryClient.setQueryData(['snippet', id], (old: any) => 
        old ? { ...old, likesCount: data.likesCount } : old
      );
    },
  });

  const handleCopyToFigma = async () => {
    if (!snippet?.figmaUrl) return;
    
    try {
      await navigator.clipboard.writeText(snippet.figmaUrl);
      toast({
        title: "Figma URL copied!",
        description: "You can now paste this design into your Figma workspace.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy to clipboard. Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like snippets.",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (!snippet || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Snippet not found</h1>
          <Link to="/">
            <Button>Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <img
            src={snippet.imageUrl}
            alt={snippet.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{snippet.title}</h1>
              <p className="text-gray-600 mb-4">{snippet.description}</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                  likeStatus?.liked ? 'text-red-500' : ''
                }`}
                disabled={likeMutation.isPending}
              >
                <Heart className={`h-4 w-4 ${likeStatus?.liked ? 'fill-current' : ''}`} />
                <span>{snippet.likesCount}</span>
              </button>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{snippet.viewsCount}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {snippet.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          
          {snippet.figmaUrl && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Figma className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-purple-900">Copy this design to Figma</h3>
                    <p className="text-sm text-purple-700">Click to copy the Figma frame URL and paste it in your workspace</p>
                  </div>
                </div>
                <Button 
                  onClick={handleCopyToFigma}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy to Figma</span>
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <User className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <Link to={`/profile/${user.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                  {user.name}
                </Link>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {snippet.plugUrl && (
              <a href={snippet.plugUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Project</span>
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
