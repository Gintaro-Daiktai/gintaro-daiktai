import type { Tag } from "@/types/tag";
import { apiClient } from "./client";

export const tagApi = {
  getTags: async (): Promise<Tag[]> => {
    return await apiClient<Tag[]>(`/tags`, {
      method: "GET",
    });
  },
};
