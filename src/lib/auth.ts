import bcrypt from "bcryptjs";
import { config } from "./config";
import { prisma } from "./prisma";
import { signJWT, verifyJWT } from "./jwt";
import { User } from "@/types";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.bcrypt.rounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(
  email: string,
  password: string,
  fullName: string
) {
  console.log("=== CREATE USER START ===");
  console.log("Input:", { email, fullName, password: "[HIDDEN]" });

  let user;

  try {
    console.log("1. Hashing password...");
    const hashedPassword = await hashPassword(password);
    console.log("2. Password hashed successfully");

    console.log("3. Testing database connection...");
    await prisma.$connect();
    console.log("4. Database connected successfully");

    console.log("5. Attempting to create user record...");
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
      },
    });
    console.log("6. User record created:", {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    });

    await prisma.$disconnect();
    console.log("7. Database disconnected");
  } catch (error) {
    console.error("=== CREATE USER ERROR ===");
    if (error instanceof Error) {
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      // Type assertion for Prisma errors that might have a code property
      if ("code" in error) {
        console.error("Error code:", (error as any).code);
      }
    }
    console.error("Full error:", error);
    throw error;
  }

  console.log("8. Creating JWT token...");
  const token = signJWT({
    userId: user.id,
    email: user.email,
  });
  console.log("9. JWT token created successfully");

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const token = signJWT({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyJWT(token);
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
