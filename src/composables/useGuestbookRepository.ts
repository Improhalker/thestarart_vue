import { useApi } from "@/composables/api/useApi";

export type GuestbookEntry = {
  id: string;
  name: string;
  content: string;
  created_at: string;
};

export type AdminGuestbookEntry = GuestbookEntry & {
  email: string;
  status: "pending" | "approved" | "rejected" | "spam";
  deleted_at: string | null;
};

type Paginated<T> = { data: T[]; meta: { current_page: number; last_page: number } };

export const useGuestbookRepository = () => {
  const { client } = useApi();

  return {
    listPublic: () => client<Paginated<GuestbookEntry>>("/public/guestbook", { method: "GET" }),
    create: (payload: { name: string; email: string; content: string; website?: string }) => client<{ data: { id: string; status: string }; message: string }>("/public/guestbook", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    }),
    listAdmin: (status?: AdminGuestbookEntry["status"]) => client<Paginated<AdminGuestbookEntry>>(`/admin/guestbook${status ? `?status=${status}` : ""}`, { method: "GET" }),
    update: (id: string, status: AdminGuestbookEntry["status"]) => client<{ data: AdminGuestbookEntry }>(`/admin/guestbook/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    }),
    remove: (id: string) => client(`/admin/guestbook/${id}`, { method: "DELETE" }),
  };
};
