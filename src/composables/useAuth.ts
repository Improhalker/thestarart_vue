import { useApi } from "./api/useApi";

interface LoginCredentials {
  email: string;
  password: Record<string, any> | string; 
}

interface LoginResponse {
  token: string;
  user?: any;
}

export const useAuthRepository = () => {
  const { client } = useApi();

  return {
    login(credentials: LoginCredentials): Promise<LoginResponse> {
      return client("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
    },
    
    async logout(): Promise<void> {
      localStorage.clear();

      // TODO - Quando o Laravel tiver o endpoint pronto, usar linha abaixo:
      // await client("/api/user/logout", { method: "POST" });
      
      return Promise.resolve();
    }
    
  };
};