<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LogOut } from "lucide-vue-next";

const router = useRouter();
const logout = () => {
  localStorage.clear();
  router.push("/login");
};
const isCollapsed = ref(false);
</script>

<template>
  <Button
    variant="ghost"
    @click="logout"
    class="w-24 p-2 flex gap-4 items-center border-2 border-black rounded-none hover:bg-red-100 hover:border-black"
  >
    <LogOut :size="20" />
    <p v-if="!isCollapsed" class="font-black uppercase text-xs">Logout</p>
  </Button>
</template>
