import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { snippetsDB } from "./db";

export interface ListSnippetsRequest {
  limit?: Query<number>;
  offset?: Query<number>;
  search?: Query<string>;
  tags?: Query<string>;
  userId?: Query<string>;
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

export interface ListSnippetsResponse {
  snippets: Snippet[];
  total: number;
}

// Lists snippets with optional filtering.
export const list = api<ListSnippetsRequest, ListSnippetsResponse>(
  { expose: true, method: "GET", path: "/snippets" },
  async (req) => {
    const limit = req.limit || 20;
    const offset = req.offset || 0;
    
    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;
    
    if (req.search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1} OR $${paramIndex + 2} = ANY(tags))`;
      const searchTerm = `%${req.search}%`;
      params.push(searchTerm, searchTerm, req.search);
      paramIndex += 3;
    }
    
    if (req.tags) {
      const tagList = req.tags.split(',').map(tag => tag.trim());
      whereClause += ` AND tags && $${paramIndex}`;
      params.push(tagList);
      paramIndex++;
    }
    
    if (req.userId) {
      whereClause += ` AND user_id = $${paramIndex}`;
      params.push(req.userId);
      paramIndex++;
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM snippets ${whereClause}`;
    const countResult = await snippetsDB.rawQueryRow<{count: number}>(countQuery, ...params);
    const total = countResult?.count || 0;
    
    // Get snippets
    const snippetsQuery = `
      SELECT id, user_id as "userId", title, description, tags, image_url as "imageUrl", 
             plug_url as "plugUrl", figma_url as "figmaUrl", likes_count as "likesCount", 
             views_count as "viewsCount", created_at as "createdAt"
      FROM snippets 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const snippets = await snippetsDB.rawQueryAll<Snippet>(snippetsQuery, ...params, limit, offset);
    
    return {
      snippets,
      total,
    };
  }
);
