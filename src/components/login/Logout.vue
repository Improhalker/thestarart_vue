<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LogOut } from "lucide-vue-next";
import { useAuthRepository } from "@/composables/useAuth";
import Button from "../ui/button/Button.vue";
const router = useRouter();
const authRepo = useAuthRepository();
const isCollapsed = ref(false);

const handleLogout = async () => {
  try {
    await authRepo.logout();
    router.push("/login");
  } catch (error) {
    console.error("Erro ao efetuar logout:", error);
  }
};
</script>

<template>
  <Button
    variant="ghost"
    @click="handleLogout"
    class="w-24 p-2 flex gap-4 items-center border-2 border-black rounded-none hover:bg-red-100 hover:border-black"
  >
    <LogOut :size="20" />
    <p v-if="!isCollapsed" class="font-black uppercase text-xs">Logout</p>
  </Button>
</template>
