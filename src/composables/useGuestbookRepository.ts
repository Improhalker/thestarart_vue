import { useApi } from "@/composables/api/useApi";

export type GuestbookEntry = {
  id: string;
  name: string;
  content: string;
  created_at: string;
};

export type AdminGuestbookEntry = GuestbookEntry & {
  email: string | null;
  status: "pending" | "approved" | "rejected" | "spam";
  deleted_at: string | null;
};

export type GuestbookPagination = { current_page: number; last_page: number; per_page: number; total: number };
type Paginated<T> = { data: T[]; meta: GuestbookPagination };

type GuestbookListFilters = {
  page?: number;
  perPage?: number;
  status?: AdminGuestbookEntry["status"];
  trashed?: "without" | "only";
};

const toSearch = (filters: GuestbookListFilters) => {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.perPage) params.set("per_page", String(filters.perPage));
  if (filters.status) params.set("status", filters.status);
  if (filters.trashed) params.set("trashed", filters.trashed);

  return params.size ? `?${params}` : "";
};

export const useGuestbookRepository = () => {
  const { client } = useApi();

  return {
    listPublic: (filters: Pick<GuestbookListFilters, "page" | "perPage"> = {}) => client<Paginated<GuestbookEntry>>(`/public/guestbook${toSearch(filters)}`, { method: "GET" }),
    create: (payload: { name: string; email: string; content: string; website?: string }) => client<{ data: { id: string; status: string }; message: string }>("/public/guestbook", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    }),
    listAdmin: (filters: GuestbookListFilters = {}) => client<Paginated<AdminGuestbookEntry>>(`/admin/guestbook${toSearch(filters)}`, { method: "GET" }),
    update: (id: string, status: AdminGuestbookEntry["status"]) => client<{ data: AdminGuestbookEntry }>(`/admin/guestbook/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    }),
    remove: (id: string) => client(`/admin/guestbook/${id}`, { method: "DELETE" }),
  };
};
