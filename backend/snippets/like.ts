import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { snippetsDB } from "./db";

export interface LikeSnippetRequest {
  id: string;
}

export interface LikeSnippetResponse {
  liked: boolean;
  likesCount: number;
}

// Toggles like status for a snippet.
export const like = api<LikeSnippetRequest, LikeSnippetResponse>(
  { auth: true, expose: true, method: "POST", path: "/snippets/:id/like" },
  async (req) => {
    const auth = getAuthData()!;
    
    // Check if snippet exists
    const snippet = await snippetsDB.queryRow<{id: string}>`
      SELECT id FROM snippets WHERE id = ${req.id}
    `;
    
    if (!snippet) {
      throw APIError.notFound("snippet not found");
    }
    
    // Check if already liked
    const existingLike = await snippetsDB.queryRow<{id: string}>`
      SELECT id FROM likes WHERE user_id = ${auth.userID} AND snippet_id = ${req.id}
    `;
    
    let liked: boolean;
    
    if (existingLike) {
      // Remove like
      await snippetsDB.exec`
        DELETE FROM likes WHERE user_id = ${auth.userID} AND snippet_id = ${req.id}
      `;
      await snippetsDB.exec`
        UPDATE snippets SET likes_count = likes_count - 1 WHERE id = ${req.id}
      `;
      liked = false;
    } else {
      // Add like
      await snippetsDB.exec`
        INSERT INTO likes (user_id, snippet_id) VALUES (${auth.userID}, ${req.id})
      `;
      await snippetsDB.exec`
        UPDATE snippets SET likes_count = likes_count + 1 WHERE id = ${req.id}
      `;
      liked = true;
    }
    
    // Get updated likes count
    const updatedSnippet = await snippetsDB.queryRow<{likesCount: number}>`
      SELECT likes_count as "likesCount" FROM snippets WHERE id = ${req.id}
    `;
    
    return {
      liked,
      likesCount: updatedSnippet!.likesCount,
    };
  }
);
