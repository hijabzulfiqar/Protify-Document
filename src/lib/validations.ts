import { z } from "zod";
import { documentCategories } from "./config";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const uploadSchema = z.object({
  category: z.enum(
    ["resume", "degrees", "certificates", "transcripts", "headshots", "others"],
    {
      message: "Invalid document category",
    }
  ),
});

export const fileValidationSchema = z.object({
  name: z.string(),
  size: z.number().max(10485760, "File size must be less than 10MB"),
  type: z.string().refine((type) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    return allowedTypes.includes(type);
  }, "File type not supported. Only PDF, Word documents, and images are allowed"),
});
