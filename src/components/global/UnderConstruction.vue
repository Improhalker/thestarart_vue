<script setup lang="ts">
const progress = 37;

const modules = [
  "Carregando ideias...",
  "Buscando inspiração...",
  "Preparando novos desenhos...",
  "Compilando novidades...",
  "Organizando conteúdo...",
];
</script>

<template>
  <div class="container-style-dark overflow-hidden">
    <CardWindowHeader title="UnderConstruction.exe" />
    <div
      class="h-8 bg-repeat-x bg-center border-t-2 border-pink-500"
      style="
        background-image: url('https://blob.gifcities.org/gifcities/CI4EJYCBCFWU6SHGDUSSX7K6NJALO5UC.gif');
        background-size: auto 100%;
      "
    />
    <div class="bg-[#090909] text-[#7CFF7C] font-pixel p-6">
      <div class="mt-6">
        <p class="mb-2 text-xs">Loading modules...</p>

        <div class="w-full h-5 border border-[#7CFF7C] bg-black overflow-hidden">
          <div
            class="h-full bg-[#7CFF7C] transition-all duration-700"
            :style="{ width: progress + '%' }"
          />
        </div>

        <p class="mt-2 text-xs">{{ progress }}% Complete</p>
      </div>

      <div class="my-8 border-t border-[#7CFF7C]/40" />

      <div class="flex flex-col lg:flex-row items-center gap-8">
        <div class="flex-1">
          <p class="text-sm font-bold">STATUS</p>

          <p class="mt-3 text-xs leading-6 text-[#A5FFA5]">
            Esta seção está atualmente em construção.
            <br /><br />
            Novo conteúdo está sendo constantemente desenvolvido e estará disponível em
            uma atualização futura.
            <br /><br />
            Obrigado por visitar.
          </p>

          <div class="mt-8 flex items-center gap-2 text-sm">
            <span>C:\Projects\TheStarArt></span>

            <span class="cursor">█</span>
          </div>
        </div>

        <img
          src="https://blob.gifcities.org/gifcities/WWHBMRW33MGDGJUEICUERULHRY5PRENR.gif"
          alt="Asuka"
          class="w-40 pixelated shrink-0"
          draggable="false"
        />
      </div>
      <div class="mt-8 space-y-2 text-xs">
        <div v-for="module in modules" :key="module" class="flex gap-2">
          <span>✓</span>
          <span>{{ module }}</span>
        </div>
      </div>
    </div>

    <div
      class="h-8 bg-repeat-x bg-center border-t-2 border-pink-500"
      style="
        background-image: url('https://blob.gifcities.org/gifcities/CI4EJYCBCFWU6SHGDUSSX7K6NJALO5UC.gif');
        background-size: auto 100%;
      "
    />
  </div>
</template>

<style scoped>
.cursor {
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
