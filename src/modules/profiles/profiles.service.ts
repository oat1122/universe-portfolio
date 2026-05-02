import { NotFoundError } from "@/shared/errors";
import { profilesRepository } from "./profiles.repository";
import type { CreateProfileInput, Profile, UpdateProfileInput } from "./profiles.types";

export const profilesService = {
  async getById(id: string): Promise<Profile> {
    const profile = await profilesRepository.findById(id);
    if (!profile) throw new NotFoundError("Profile not found");
    return profile;
  },

  async getByUsername(username: string): Promise<Profile> {
    const profile = await profilesRepository.findByUsername(username);
    if (!profile) throw new NotFoundError("Profile not found");
    return profile;
  },

  async create(id: string, input: CreateProfileInput): Promise<Profile> {
    return profilesRepository.create({ ...input, id });
  },

  async update(id: string, input: UpdateProfileInput): Promise<Profile> {
    const updated = await profilesRepository.update(id, input);
    if (!updated) throw new NotFoundError("Profile not found");
    return updated;
  },
};
