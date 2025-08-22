import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Upload as UploadIcon, X, Figma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../hooks/useAuth';
import { useBackend } from '../hooks/useBackend';

export default function Upload() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const backend = useBackend();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    plugUrl: '',
    figmaUrl: '',
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      tags: string[];
      imageData: string;
      imageType: string;
      plugUrl?: string;
      figmaUrl?: string;
    }) => {
      return backend.snippets.create(data);
    },
    onSuccess: () => {
      toast({
        title: "Snippet uploaded!",
        description: "Your UI snippet has been uploaded successfully.",
      });
      navigate('/');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your snippet. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isSignedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">You need to sign in to upload snippets.</p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, GIF, or SVG)",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateFigmaUrl = (url: string) => {
    if (!url) return true; // Optional field
    const figmaPattern = /^https:\/\/(www\.)?figma\.com\/(file|proto|design)\/[a-zA-Z0-9]+/;
    return figmaPattern.test(url);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your snippet",
        variant: "destructive",
      });
      return;
    }

    if (formData.figmaUrl && !validateFigmaUrl(formData.figmaUrl)) {
      toast({
        title: "Invalid Figma URL",
        description: "Please enter a valid Figma file, prototype, or design URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageData = await fileToBase64(selectedFile);
      
      uploadMutation.mutate({
        title: formData.title,
        description: formData.description || undefined,
        tags: formData.tags,
        imageData,
        imageType: selectedFile.type,
        plugUrl: formData.plugUrl || undefined,
        figmaUrl: formData.figmaUrl || undefined,
      });
    } catch (error) {
      toast({
        title: "Error processing image",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload UI Snippet</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="image-upload">Image</Label>
            <div className="mt-2">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, or SVG (MAX. 10MB)</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.svg"
                    onChange={handleFileSelect}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a title for your snippet"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your UI snippet..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="figma-url" className="flex items-center space-x-2">
              <Figma className="h-4 w-4" />
              <span>Figma Frame URL (Optional)</span>
            </Label>
            <Input
              id="figma-url"
              type="url"
              value={formData.figmaUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, figmaUrl: e.target.value }))}
              placeholder="https://www.figma.com/file/..."
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste your Figma frame URL so others can copy this design to their Figma workspace
            </p>
          </div>

          <div>
            <Label htmlFor="plug-url">Project URL (Optional)</Label>
            <Input
              id="plug-url"
              type="url"
              value={formData.plugUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, plugUrl: e.target.value }))}
              placeholder="https://your-portfolio.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="mt-2 space-y-2">
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Snippet'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
