export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  plugUrl?: string;
  createdAt: string;
}

export interface Snippet {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  plugUrl?: string;
  likes: number;
  views: number;
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  snippetId: string;
  createdAt: string;
}

export interface View {
  id: string;
  userId: string;
  snippetId: string;
  createdAt: string;
}
