import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { snippetsDB } from "./db";

export interface GetSnippetRequest {
  id: string;
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

// Gets a snippet by ID and increments view count.
export const get = api<GetSnippetRequest, Snippet>(
  { expose: true, method: "GET", path: "/snippets/:id" },
  async (req) => {
    const snippet = await snippetsDB.queryRow<Snippet>`
      SELECT id, user_id as "userId", title, description, tags, image_url as "imageUrl", 
             plug_url as "plugUrl", figma_url as "figmaUrl", likes_count as "likesCount", 
             views_count as "viewsCount", created_at as "createdAt"
      FROM snippets 
      WHERE id = ${req.id}
    `;

    if (!snippet) {
      throw APIError.notFound("snippet not found");
    }

    // Record view (anonymous or authenticated)
    const auth = getAuthData();
    await snippetsDB.exec`
      INSERT INTO views (user_id, snippet_id)
      VALUES (${auth?.userID}, ${req.id})
    `;

    // Update view count
    await snippetsDB.exec`
      UPDATE snippets 
      SET views_count = views_count + 1 
      WHERE id = ${req.id}
    `;

    snippet.viewsCount += 1;
    return snippet;
  }
);
