<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";

import CardWindowHeader from "@/components/global/CardWindowHeader.vue";

const route = useRoute();

const code = computed(() => Number(route.params.code));

const errors: Record<number, { title: string; description: string }> = {
  400: {
    title: "Requisição inválida",
    description: "O servidor recebeu uma solicitação que não conseguiu compreender.",
  },

  401: {
    title: "Não autenticado",
    description: "Você precisa estar autenticado para acessar esta página.",
  },

  403: {
    title: "Acesso negado",
    description: "Você não possui permissão para acessar este conteúdo.",
  },

  404: {
    title: "Página não encontrada",
    description: "A página que você tentou acessar não existe ou foi movida.",
  },

  429: {
    title: "Muitas requisições",
    description: "Calma! Muitas requisições foram feitas em pouco tempo.",
  },

  500: {
    title: "Erro interno",
    description: "Algo inesperado aconteceu enquanto processávamos sua solicitação.",
  },

  502: {
    title: "Gateway inválido",
    description: "O servidor recebeu uma resposta inválida de outro serviço.",
  },

  503: {
    title: "Serviço indisponível",
    description: "O servidor está temporariamente indisponível.",
  },
};

const currentError = computed(() => {
  return (
    errors[code.value] ?? {
      title: "Erro desconhecido",
      description: "O sistema encontrou um erro inesperado.",
    }
  );
});

const randomMessages = [
  "Talvez esta página ainda esteja sendo desenhada...",
  "O dev jura estar trabalhando nessa pagina.",
  "Ou voce acessou uma url que nao existe mesmo, ou o dev deixou escapar algo.",
  "O compilador ficou um pouco confuso, eu voltaria pra home.",
  "Nada foi encontrado por aqui nao, acho melhor voltar.",
];

const funnyMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center p-4 bg-repeat"
    style="background-image: url('/images/bluebox.gif')"
  >
    <div class="container-style-dark max-w-5xl w-full overflow-hidden">
      <CardWindowHeader :title="`Error${code}.exe`" />

      <div
        class="h-8 bg-repeat-x border-t-2 border-pink-500"
        style="
          background-image: url('https://blob.gifcities.org/gifcities/CI4EJYCBCFWU6SHGDUSSX7K6NJALO5UC.gif');
          background-size: auto 100%;
        "
      />

      <div class="bg-[#090909] text-[#7CFF7C] p-8 font-pixel">
        <pre class="text-xs leading-6 whitespace-pre-wrap">

<p class="text-4xl">ERRO {{ code }}</p>
<p>
{{ currentError.title }}

{{ currentError.description }}

> {{ funnyMessage }}
(C) 2026 TheStarArt_. Todos os direitos reservados.

C:\TheStarArt>
</p>
</pre>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/"
            class="px-4 py-2 border-2 border-pink-500 bg-[#1b2934] hover:bg-pink-500 transition"
          >
            Voltar para Home
          </RouterLink>

          <button
            class="px-4 py-2 border-2 border-pink-500 bg-[#1b2934] hover:bg-pink-500 transition"
            @click="$router.back()"
          >
            Página anterior
          </button>
        </div>
      </div>

      <div
        class="h-8 bg-repeat-x border-t-2 border-pink-500"
        style="
          background-image: url('https://blob.gifcities.org/gifcities/CI4EJYCBCFWU6SHGDUSSX7K6NJALO5UC.gif');
          background-size: auto 100%;
        "
      />
    </div>
  </main>
</template>
