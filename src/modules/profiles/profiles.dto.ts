import { z } from "zod";

export const createProfileDto = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Username must be lowercase letters, numbers, or underscores"),
  displayName: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

// Username is immutable post-creation, so it's stripped from the update payload.
export const updateProfileDto = createProfileDto.partial().omit({ username: true });

export type CreateProfileDto = z.infer<typeof createProfileDto>;
export type UpdateProfileDto = z.infer<typeof updateProfileDto>;
