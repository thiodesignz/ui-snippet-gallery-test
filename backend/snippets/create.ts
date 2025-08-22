import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { snippetsDB } from "./db";
import { snippetImages } from "./storage";

export interface CreateSnippetRequest {
  title: string;
  description?: string;
  tags: string[];
  imageData: string; // base64 encoded image
  imageType: string; // mime type
  plugUrl?: string;
  figmaUrl?: string;
}

export interface Snippet {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  tags: string[];
  imageUrl: string;
  plugUrl: string | null;
  figmaUrl: string | null;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
}

// Creates a new snippet.
export const create = api<CreateSnippetRequest, Snippet>(
  { auth: true, expose: true, method: "POST", path: "/snippets" },
  async (req) => {
    const auth = getAuthData()!;
    
    // Decode base64 image data
    const imageBuffer = Buffer.from(req.imageData, 'base64');
    
    // Generate unique filename
    const fileExtension = req.imageType.split('/')[1];
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    // Upload image to storage
    await snippetImages.upload(fileName, imageBuffer, {
      contentType: req.imageType,
    });
    
    const imageUrl = snippetImages.publicUrl(fileName);
    
    // Create snippet in database
    const snippet = await snippetsDB.queryRow<Snippet>`
      INSERT INTO snippets (user_id, title, description, tags, image_url, plug_url, figma_url)
      VALUES (${auth.userID}, ${req.title}, ${req.description}, ${req.tags}, ${imageUrl}, ${req.plugUrl}, ${req.figmaUrl})
      RETURNING id, user_id as "userId", title, description, tags, image_url as "imageUrl", 
                plug_url as "plugUrl", figma_url as "figmaUrl", likes_count as "likesCount", 
                views_count as "viewsCount", created_at as "createdAt"
    `;
    
    return snippet!;
  }
);
