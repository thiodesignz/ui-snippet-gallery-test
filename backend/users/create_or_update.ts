import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { usersDB } from "./db";

export interface CreateOrUpdateUserRequest {
  name?: string;
  plugUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  plugUrl: string | null;
  createdAt: string;
}

// Creates or updates the current user's profile.
export const createOrUpdate = api<CreateOrUpdateUserRequest, User>(
  { auth: true, expose: true, method: "POST", path: "/users/me" },
  async (req) => {
    const auth = getAuthData()!;
    
    // Check if user exists
    const existingUser = await usersDB.queryRow<User>`
      SELECT id, name, email, avatar_url as "avatarUrl", plug_url as "plugUrl", 
             created_at as "createdAt"
      FROM users 
      WHERE id = ${auth.userID}
    `;

    if (existingUser) {
      // Update existing user
      const updatedUser = await usersDB.queryRow<User>`
        UPDATE users 
        SET name = COALESCE(${req.name}, name),
            plug_url = ${req.plugUrl},
            avatar_url = ${auth.imageUrl}
        WHERE id = ${auth.userID}
        RETURNING id, name, email, avatar_url as "avatarUrl", plug_url as "plugUrl", 
                  created_at as "createdAt"
      `;
      return updatedUser!;
    } else {
      // Create new user
      const newUser = await usersDB.queryRow<User>`
        INSERT INTO users (id, name, email, avatar_url, plug_url)
        VALUES (${auth.userID}, ${req.name || auth.name}, ${auth.email}, ${auth.imageUrl}, ${req.plugUrl})
        RETURNING id, name, email, avatar_url as "avatarUrl", plug_url as "plugUrl", 
                  created_at as "createdAt"
      `;
      return newUser!;
    }
  }
);
