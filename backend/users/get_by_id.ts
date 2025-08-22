import { api, APIError } from "encore.dev/api";
import { usersDB } from "./db";

export interface GetUserRequest {
  id: string;
}

export interface User {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  plugUrl: string | null;
  createdAt: string;
}

// Gets a user by ID.
export const getById = api<GetUserRequest, User>(
  { expose: true, method: "GET", path: "/users/:id" },
  async (req) => {
    const user = await usersDB.queryRow<User>`
      SELECT id, name, email, avatar_url as "avatarUrl", plug_url as "plugUrl", 
             created_at as "createdAt"
      FROM users 
      WHERE id = ${req.id}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    return user;
  }
);
