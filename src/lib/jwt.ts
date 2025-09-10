import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "./config";

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function signJWT(payload: Omit<JWTPayload, "iat" | "exp">): string {
  if (!config.jwt.secret) {
    throw new Error("JWT secret is not configured");
  }

  // Use the jsonwebtoken sign method with proper overload
  return jwt.sign(
    payload,
    config.jwt.secret,
    { expiresIn: "7d" } // Use hardcoded value to avoid type issues
  );
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    if (!config.jwt.secret) {
      throw new Error("JWT secret is not configured");
    }
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromHeader(authorization?: string): string | null {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }
  return authorization.slice(7);
}
