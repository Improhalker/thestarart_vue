<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import { useAuth } from "@/composables/useAuth";
import { fallbackLoginWallpaper, selectLoginWallpaper } from "./loginWallpapers";

const router = useRouter();
const route = useRoute();
const { checkSession, error, fieldErrors, isCheckingSession, isLoggingIn, login } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoginReady = ref(false);
const selectedWallpaper = ref(selectLoginWallpaper());
const isWallpaperReady = ref(false);
const wallpaperLoadFailed = ref(false);

const emailError = computed(() => fieldErrors.value.email?.[0]);
const passwordError = computed(() => fieldErrors.value.password?.[0]);

const wallpaperDetails = computed(() => `WALLPAPER: ${selectedWallpaper.value.label}`);

const handleWallpaperError = () => {
  if (selectedWallpaper.value.id !== fallbackLoginWallpaper.id) {
    selectedWallpaper.value = fallbackLoginWallpaper;
    return;
  }

  wallpaperLoadFailed.value = true;
};

onMounted(async () => {
  await checkSession();
  isLoginReady.value = true;
});

const submit = async () => {
  try {
    await login({ email: email.value, password: password.value });

    const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/admin";
    await router.push(redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/admin");
  } catch {
    // O composable transforma falhas conhecidas em mensagens seguras para a interface.
  }
};
</script>

<template>
  <main class="login-shell min-h-screen overflow-hidden bg-ts-black font-mono text-white">
    <section class="login-panel justify-center relative z-10 flex min-h-screen items-center px-4 py-6 sm:px-8 lg:px-10">
      <div
        class="w-full max-w-md border-2 border-ts-pink bg-ts-black-secondary shadow-[8px_8px_0_var(--ts-primary-black)] sm:shadow-[12px_12px_0_var(--ts-primary-black)]">
        <CardWindowHeader title="Admin_Access.exe" :icon="ShieldCheck" :hide-window-buttons="true">
          <template #right>
            <span class="mr-2 flex items-center gap-1 text-[10px] font-bold text-white/85">
              <LockKeyhole :size="12" aria-hidden="true" />
              RESTRICTED
            </span>
          </template>
        </CardWindowHeader>

        <div class="border-b border-ts-pink/60 bg-ts-black px-5 py-3 text-[11px] text-white/70 sm:px-6">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 shrink-0 bg-ts-ui-accent" aria-hidden="true" />
            <span>THESTARART SYSTEM // área privada!!</span>
          </div>
        </div>

        <div v-if="!isLoginReady || isCheckingSession" class="space-y-5 p-5 sm:p-6 min-h-[420px] min-w-[335px]" aria-live="polite" aria-busy="true">
          <div class="space-y-2">
            <div class="h-5 w-3/4 animate-pulse bg-ts-pink/30" />
            <div class="h-3 w-2/3 animate-pulse bg-white/10" />
          </div>
          <div class="h-12 animate-pulse border border-ts-pink/40 bg-white/10" />
          <div class="h-12 animate-pulse border border-ts-pink/40 bg-white/10" />
          <div class="flex items-center gap-2 border-t border-ts-pink/50 pt-4 text-xs text-white/75">
            <LoaderCircle :size="16" class="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Verificando sessão segura...
          </div>
        </div>

        <form v-else class="space-y-5 p-5 sm:p-6" :aria-busy="isLoggingIn" @submit.prevent="submit" novalidate>
          <div class="space-y-2">
            <h1 class="font-pixel text-xl font-bold tracking-wide text-white">Acesso administrativo</h1>
            <p class="max-w-sm text-sm leading-5 text-white/75">
              Se voce nao for o TheStarArt, voce nao conseguira acessar esta area, voce pode voltar para o site clicando no botao abaixo do formulario! 
            </p>
          </div>

          <div v-if="error" role="alert"
            class="border border-ts-ui-accent bg-ts-pink/30 p-3 text-sm leading-5 text-white">
            <span class="font-bold">Falha de acesso:</span> {{ error }}
          </div>

          <div class="space-y-2">
            <label for="admin-email" class="font-pixel text-sm font-bold text-white">E-mail</label>
            <div
              class="flex border-2 border-ts-pink bg-white text-black focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ts-ui-accent">
              <Mail :size="18" class="m-3 shrink-0 text-ts-pink" aria-hidden="true" />
              <input id="admin-email" v-model.trim="email" type="email" autocomplete="email" required
                :aria-invalid="Boolean(emailError)" :aria-describedby="emailError ? 'admin-email-error' : undefined"
                class="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base outline-none placeholder:text-black/50"
                placeholder="seu-email@exemplo.com" />
            </div>
            <p v-if="emailError" id="admin-email-error" class="text-sm font-bold text-ts-ui-accent-soft">{{ emailError
            }}</p>
          </div>

          <div class="space-y-2">
            <label for="admin-password" class="font-pixel text-sm font-bold text-white">Senha</label>
            <div
              class="flex border-2 border-ts-pink bg-white text-black focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ts-ui-accent">
              <KeyRound :size="18" class="m-3 shrink-0 text-ts-pink" aria-hidden="true" />
              <input id="admin-password" v-model="password" :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password" required :aria-invalid="Boolean(passwordError)"
                :aria-describedby="passwordError ? 'admin-password-error' : undefined"
                class="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base outline-none placeholder:text-black/50"
                placeholder="Digite sua senha" />
              <button type="button"
                class="min-h-11 border-l-2 border-ts-pink px-3 transition-colors hover:bg-ts-ui-bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ts-ui-accent"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" :size="18" aria-hidden="true" />
                <Eye v-else :size="18" aria-hidden="true" />
              </button>
            </div>
            <p v-if="passwordError" id="admin-password-error" class="text-sm font-bold text-ts-ui-accent-soft">{{
              passwordError
            }}</p>
          </div>

          <button type="submit" :disabled="isLoggingIn"
            class="retro-btn min-h-12 w-full gap-2 border-2 border-white px-4 py-3 font-pixel text-sm font-bold tracking-wide shadow-[4px_4px_0_var(--ts-primary-red)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-ui-accent disabled:cursor-wait disabled:opacity-65">
            <LoaderCircle v-if="isLoggingIn" :size="17" class="animate-spin motion-reduce:animate-none"
              aria-hidden="true" />
            <ShieldCheck v-else :size="17" aria-hidden="true" />
            {{ isLoggingIn ? "Verificando acesso..." : "Entrar no sistema" }}
          </button>
        </form>

        <footer
          class="flex items-center justify-between gap-4 border-t border-ts-pink/60 bg-ts-black px-5 py-3 text-[11px] text-white/70 sm:px-6">
          <RouterLink to="/"
            class="inline-flex min-h-8 items-center gap-1.5 underline decoration-ts-pink underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ts-ui-accent">
            <ArrowLeft :size="14" aria-hidden="true" />
            Voltar ao site
          </RouterLink>
          <span class="hidden shrink-0 font-pixel text-[10px] sm:inline">System online</span>
        </footer>
      </div>
    </section>

    <aside
      class="login-wallpaper-caption absolute bottom-5 right-5 z-10 hidden border border-ts-pink/70 bg-ts-black/90 px-3 py-2 text-[10px] text-white/80 lg:block"
      aria-hidden="true">
      {{ wallpaperDetails }}
    </aside>

    <div class="login-wallpaper" aria-hidden="true">
      <img v-if="!wallpaperLoadFailed" :src="selectedWallpaper.src" alt="" fetchpriority="high"
        class="h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none"
        :class="isWallpaperReady ? 'opacity-100' : 'opacity-0'" @load="isWallpaperReady = true"
        @error="handleWallpaperError" />
      <div class="login-wallpaper-shade" />
    </div>
  </main>
</template>

<style scoped>
.login-shell {
  display: flex;
  position: relative;
}

.login-wallpaper {
  inset: 0;
  position: absolute;
}

.login-wallpaper-shade {
  background: linear-gradient(180deg, rgb(3 1 14 / 58%), rgb(1 3 37 / 46%));
  inset: 0;
  position: absolute;
}

.login-panel {
  background: linear-gradient(135deg, rgb(3 1 14 / 34%), rgb(1 3 37 / 52%));
}

@media screen and (max-width: 1023px) {
  .login-panel {
    width: 100%;
  }
}

@media (min-width: 1024px) {
  .login-panel {
    background: linear-gradient(135deg, rgb(3 1 14 / 100%), rgb(1 3 37 / 98%));
  }

  .login-wallpaper {
    grid-column: 2;
    position: relative;
  }

  .login-wallpaper-shade {
    background: linear-gradient(90deg, rgb(3 1 14 / 28%), rgb(1 3 37 / 8%));
  }
}
</style>
