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

export const resolveApiBaseUrl = (isDevelopment: boolean, configuredUrl?: string) => {
  // Produção conversa com Laravel pelo reverse proxy da Vercel. Isso faz com
  // que a sessão Sanctum seja de primeira parte, mesmo sem domínio próprio.
  if (!isDevelopment) return "/api";

  return (configuredUrl || "http://localhost:8000/api").replace(/\/$/, "");
};

export const resolveCsrfUrl = (apiBase: string, currentOrigin: string) =>
  `${new URL(apiBase, currentOrigin).origin}/sanctum/csrf-cookie`;

const apiBaseUrl = () => resolveApiBaseUrl(import.meta.env.DEV, import.meta.env.VITE_API_URL);

const csrfUrl = () => resolveCsrfUrl(apiBaseUrl(), window.location.origin);

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
