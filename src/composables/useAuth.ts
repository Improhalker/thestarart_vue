import { computed, ref } from "vue";
import { ApiError, useApi } from "./api/useApi";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type AuthResponse = {
  data: AuthUser;
};

type ValidationErrors = Record<string, string[]>;

const user = ref<AuthUser | null>(null);
const isCheckingSession = ref(false);
const isLoggingIn = ref(false);
const isLoggingOut = ref(false);
const error = ref<string | null>(null);
const fieldErrors = ref<ValidationErrors>({});
let pendingSessionCheck: Promise<AuthUser | null> | null = null;

const clearAuthState = () => {
  user.value = null;
};

const errorMessage = (cause: unknown, fallback: string) => {
  if (!(cause instanceof ApiError)) return "Não foi possível conectar ao servidor.";

  if (cause.status === 401) return "E-mail ou senha inválidos.";
  if (cause.status === 419) return "Sua sessão segura expirou. Tente novamente.";
  if (cause.status === 429) return "Muitas tentativas. Aguarde alguns minutos.";
  if (cause.status >= 500) return "Não foi possível conectar ao servidor.";

  return cause.message || fallback;
};

const validationErrorsFrom = (cause: unknown): ValidationErrors => {
  if (!(cause instanceof ApiError) || cause.status !== 422) return {};

  const payload = cause.payload as { errors?: unknown } | null;
  return payload?.errors && typeof payload.errors === "object"
    ? (payload.errors as ValidationErrors)
    : {};
};

export const useAuth = () => {
  const { client, requestCsrfCookie } = useApi();
  const isAuthenticated = computed(() => user.value !== null);

  const checkSession = async (): Promise<AuthUser | null> => {
    if (pendingSessionCheck) return pendingSessionCheck;

    isCheckingSession.value = true;

    pendingSessionCheck = (async () => {
      try {
        const response = await client<AuthResponse>("/me", { method: "GET" }, { handleUnauthorized: false });
        user.value = response.data;
        return user.value;
      } catch (cause) {
        clearAuthState();

        if (!(cause instanceof ApiError) || cause.status !== 401) {
          error.value = "Não foi possível verificar sua sessão.";
        }

        return null;
      } finally {
        isCheckingSession.value = false;
        pendingSessionCheck = null;
      }
    })();

    return pendingSessionCheck;
  };

  const login = async (credentials: LoginCredentials) => {
    error.value = null;
    fieldErrors.value = {};
    isLoggingIn.value = true;

    try {
      await requestCsrfCookie();
      const response = await client<AuthResponse>(
        "/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        },
        { handleUnauthorized: false },
      );

      user.value = response.data;
      return user.value;
    } catch (cause) {
      fieldErrors.value = validationErrorsFrom(cause);
      error.value = errorMessage(cause, "Não foi possível entrar.");
      throw cause;
    } finally {
      isLoggingIn.value = false;
    }
  };

  const logout = async () => {
    error.value = null;
    isLoggingOut.value = true;

    try {
      await client("/logout", { method: "POST" }, { handleUnauthorized: false });
      clearAuthState();
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        clearAuthState();
        error.value = "Sua sessão já havia expirado.";
        return;
      }

      error.value = errorMessage(cause, "Não foi possível encerrar a sessão.");
      throw cause;
    } finally {
      isLoggingOut.value = false;
    }
  };

  const handleSessionExpired = () => {
    clearAuthState();
    fieldErrors.value = {};
    error.value = "Sua sessão expirou. Entre novamente.";
  };

  return {
    user,
    isAuthenticated,
    isCheckingSession,
    isLoggingIn,
    isLoggingOut,
    error,
    fieldErrors,
    checkSession,
    login,
    logout,
    handleSessionExpired,
  };
};
