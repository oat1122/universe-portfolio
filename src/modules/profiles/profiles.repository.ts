import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/client";
import { profiles } from "./profiles.schema";
import type { CreateProfileInput, Profile, UpdateProfileInput } from "./profiles.types";

export const profilesRepository = {
  async findById(id: string): Promise<Profile | null> {
    const [row] = await db.select().from(profiles).where(eq(profiles.id, id));
    return row ?? null;
  },

  async findByUsername(username: string): Promise<Profile | null> {
    const [row] = await db.select().from(profiles).where(eq(profiles.username, username));
    return row ?? null;
  },

  async create(data: CreateProfileInput & { id: string }): Promise<Profile> {
    const [row] = await db.insert(profiles).values(data).returning();
    // INSERT ... RETURNING always emits exactly one row when it doesn't throw,
    // but TS strict (noUncheckedIndexedAccess) can't infer that — assert here.
    if (!row) throw new Error("Insert into profiles returned no row");
    return row;
  },

  async update(id: string, data: UpdateProfileInput): Promise<Profile | null> {
    const [row] = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return row ?? null;
  },
};
