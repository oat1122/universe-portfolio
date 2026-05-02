import { z } from "zod";

export const loginDto = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"), // bcrypt hard cap is 72 bytes
});

export type LoginDto = z.infer<typeof loginDto>;
