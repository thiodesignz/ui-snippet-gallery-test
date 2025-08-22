import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { snippetsDB } from "./db";

export interface GetLikeStatusRequest {
  id: string;
}

export interface GetLikeStatusResponse {
  liked: boolean;
}

// Gets the like status for a snippet for the current user.
export const getLikeStatus = api<GetLikeStatusRequest, GetLikeStatusResponse>(
  { auth: true, expose: true, method: "GET", path: "/snippets/:id/like" },
  async (req) => {
    const auth = getAuthData()!;
    
    const like = await snippetsDB.queryRow<{id: string}>`
      SELECT id FROM likes WHERE user_id = ${auth.userID} AND snippet_id = ${req.id}
    `;
    
    return {
      liked: !!like,
    };
  }
);
