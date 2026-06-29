export const useApi = () => {
  const token = localStorage.getItem("token");

  const client = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl =
      import.meta.env.VITE_API_URL ||
      "http://thestarartlaravelback.test";

    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data?.message || "Erro na requisição"
      );
    }

    return data;
  };

  return { client };
};