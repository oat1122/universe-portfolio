import type { NextResponse } from "next/server";
import { handleError, ok } from "@/shared/lib/api-response";
import { profilesService } from "./profiles.service";

export const profilesController = {
  async getByUsername(username: string): Promise<NextResponse> {
    try {
      const profile = await profilesService.getByUsername(username);
      return ok(profile);
    } catch (e) {
      return handleError(e);
    }
  },
};
