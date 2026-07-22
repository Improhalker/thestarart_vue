<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LogOut } from "lucide-vue-next";
import { useAuth } from "@/composables/useAuth";
import Button from "../ui/button/Button.vue";

const router = useRouter();
const { error, isLoggingOut, logout } = useAuth();
const logoutError = ref<string | null>(null);

const handleLogout = async () => {
  logoutError.value = null;

  try {
    await logout();
    await router.push({ name: "login" });
  } catch {
    logoutError.value = error.value || "Não foi possível encerrar a sessão.";
  }
};
</script>

<template>
  <div class="px-4 py-3 border-b-2 border-black">
    <Button
      variant="ghost"
      :disabled="isLoggingOut"
      :aria-busy="isLoggingOut"
      @click="handleLogout"
      class="w-full p-2 flex gap-3 items-center justify-center border-2 border-black rounded-none hover:bg-red-100 hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-60"
    >
      <LogOut :size="18" aria-hidden="true" />
      <span class="font-black uppercase text-xs">{{ isLoggingOut ? "Saindo..." : "Logout" }}</span>
    </Button>
    <p v-if="logoutError" role="alert" class="mt-2 text-[10px] font-bold text-red-700">{{ logoutError }}</p>
  </div>
</template>
