import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { profiles } from "./profiles.schema";

export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

// Caller supplies `id` separately (it equals auth.users.id), so it's omitted here.
export type CreateProfileInput = Omit<NewProfile, "id" | "createdAt" | "updatedAt">;

// Username is immutable after creation — service must reject any attempt to change it.
export type UpdateProfileInput = Partial<
  Omit<NewProfile, "id" | "username" | "createdAt" | "updatedAt">
>;
