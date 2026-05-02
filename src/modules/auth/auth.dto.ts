import { z } from "zod";

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72), // bcrypt hard cap is 72 bytes
});

export type LoginDto = z.infer<typeof loginDto>;
