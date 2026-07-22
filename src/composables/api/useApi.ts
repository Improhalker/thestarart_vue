export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestBehavior = {
  handleUnauthorized?: boolean;
};

let unauthorizedHandler: (() => void) | undefined;

export const setUnauthorizedHandler = (handler?: () => void) => {
  unauthorizedHandler = handler;
};

const apiBaseUrl = () =>
  (import.meta.env.VITE_API_URL || "http://thestarartlaravelback.test/api").replace(/\/$/, "");

const csrfUrl = () => `${new URL(apiBaseUrl()).origin}/sanctum/csrf-cookie`;

const readXsrfToken = () => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : null;
};

const messageFrom = (data: unknown) => {
  if (typeof data === "string") return data;

  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }

  return "Não foi possível concluir a requisição.";
};

export const useApi = () => {
  const client = async <T = any>(
    endpoint: string,
    options: RequestInit = {},
    behavior: RequestBehavior = {},
  ): Promise<T> => {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");

    if (!["GET", "HEAD", "OPTIONS"].includes((options.method || "GET").toUpperCase())) {
      const token = readXsrfToken();

      if (token) headers.set("X-XSRF-TOKEN", token);
    }

    const response = await fetch(`${apiBaseUrl()}${endpoint}`, {
      ...options,
      credentials: "include",
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (response.status === 401 && behavior.handleUnauthorized !== false) {
        unauthorizedHandler?.();
      }

      throw new ApiError(messageFrom(data), response.status, data);
    }

    return data as T;
  };

  const requestCsrfCookie = async () => {
    const response = await fetch(csrfUrl(), {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new ApiError("Não foi possível preparar a sessão segura.", response.status, null);
    }
  };

  return { client, requestCsrfCookie };
};
