import { readonly, ref } from "vue";

export type ToastTone = "error";

export type ToastOptions = {
  duration?: number;
  tone?: ToastTone;
};

export type ToastNotification = {
  id: number;
  message: string;
  tone: ToastTone;
};

const DEFAULT_DURATION_MS = 4_000;

let nextToastId = 1;
const notifications = ref<ToastNotification[]>([]);
const dismissalTimers = new Map<number, ReturnType<typeof setTimeout>>();

const dismiss = (id: number) => {
  notifications.value = notifications.value.filter((notification) => notification.id !== id);

  const timer = dismissalTimers.get(id);
  if (timer) clearTimeout(timer);

  dismissalTimers.delete(id);
};

const show = (message: string, options: ToastOptions = {}) => {
  const id = nextToastId;
  nextToastId += 1;

  notifications.value = [
    ...notifications.value,
    {
      id,
      message,
      tone: options.tone ?? "error",
    },
  ];

  const duration = options.duration ?? DEFAULT_DURATION_MS;
  if (duration > 0) {
    dismissalTimers.set(id, setTimeout(() => dismiss(id), duration));
  }

  return id;
};

export const useToast = () => ({
  notifications: readonly(notifications),
  show,
  dismiss,
});
