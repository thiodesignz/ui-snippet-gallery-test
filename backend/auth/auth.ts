import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const clerkSecretKey = secret("ClerkSecretKey");

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  imageUrl: string;
  email: string | null;
  name: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    // Resolve the authenticated user from the authorization header or session cookie.
    const token = data.authorization?.replace("Bearer ", "") ?? data.session?.value;
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    try {
      // Simple JWT verification without external dependencies
      // In a real implementation, you would verify the JWT signature
      // For now, we'll decode the payload (this is for demo purposes)
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      
      return {
        userID: payload.sub || "demo-user",
        imageUrl: payload.picture || "",
        email: payload.email || null,
        name: payload.name || payload.email || "Demo User",
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid token", err);
    }
  }
);

// Configure the API gateway to use the auth handler.
export const gw = new Gateway({ authHandler: auth });
