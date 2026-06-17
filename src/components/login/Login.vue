<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200">
    <div
      class="w-full max-w-sm bg-white border-4 border-black shadow-[8px_8px_0px_black] p-6 space-y-4"
    >
      <div class="text-center">
        <h1 class="text-xl font-black uppercase">Admin Login</h1>
        <p class="text-[10px] text-gray-500">Estrela_OS Secure Access</p>
      </div>

      <div class="space-y-2">
        <input
          v-model="email"
          type="email"
          placeholder="email"
          class="w-full border-2 border-black p-2 text-xs font-mono"
        />

        <input
          v-model="password"
          type="password"
          placeholder="senha"
          class="w-full border-2 border-black p-2 text-xs font-mono"
        />
      </div>

      <button
        @click="login"
        class="w-full border-2 border-black bg-black text-white text-xs font-black uppercase p-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_pink] transition-all"
      >
        Entrar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const email = ref("");
const password = ref("");

const login = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, {
      email: email.value,
      password: password.value,
    });

    const token = response.data.token;
    //remover do local storage futuramente
    localStorage.setItem("auth", "true");
    localStorage.setItem("token", token);

    router.push("/admin");
  } catch (error) {
    console.error(error);

    alert("Email ou senha inválidos.");
  }
};
</script>
