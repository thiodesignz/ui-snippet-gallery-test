import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { usersDB } from "./db";

export interface User {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  plugUrl: string | null;
  createdAt: string;
}

// Gets the current user's profile.
export const getMe = api<void, User>(
  { auth: true, expose: true, method: "GET", path: "/users/me" },
  async () => {
    const auth = getAuthData()!;
    
    const user = await usersDB.queryRow<User>`
      SELECT id, name, email, avatar_url as "avatarUrl", plug_url as "plugUrl", 
             created_at as "createdAt"
      FROM users 
      WHERE id = ${auth.userID}
    `;

    if (!user) {
      // Auto-create user if not exists
      const newUser = await usersDB.queryRow<User>`
        INSERT INTO users (id, name, email, avatar_url)
        VALUES (${auth.userID}, ${auth.name}, ${auth.email}, ${auth.imageUrl})
        RETURNING id, name, email, avatar_url as "avatarUrl", plug_url as "plugUrl", 
                  created_at as "createdAt"
      `;
      return newUser!;
    }

    return user;
  }
);
