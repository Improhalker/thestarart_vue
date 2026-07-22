import { useApi } from "@/composables/api/useApi";

type Music = {
  id: number;
  title: string;
  youtube_id: string;
  description: string | null;
  day_of_week: number;
};

type MusicListResponse = {
  data: Music[];
};

const { client } = useApi();

export const MusicService = {
  getAll(): Promise<MusicListResponse> {
    return client("/musics", { method: "GET" });
  },

  create(payload: Record<string, unknown>) {
    return client("/musics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  update(id: number, payload: Record<string, unknown>) {
    return client(`/musics/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  delete(id: number) {
    return client(`/musics/${id}`, { method: "DELETE" });
  },
};
