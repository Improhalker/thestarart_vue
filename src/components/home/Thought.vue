<script setup lang="ts">
import CardWindowHeader from "../global/CardWindowHeader.vue";

const terminalSections = [
  {
    title: ">> WHOAMI",
    content: `
      Bom, meu codinome é <strong>TheStarArt_</strong> e tenho 21 anos.
      Esse projeto é uma tentativa de expressar tudo o que gosto e vivo neste mundo. <br>
      ┐(´～｀)┌
    `,
  },
  {
    title: ">> CURRENT_INTERESTS",
    items: [
      "Jogar CS2 de AWP",
      "Programação com Vue, PHP, WordPress, Webflow e ambientes Linux 🐧",
      "Lápis de cor (estou voltando a desenhar mais) ✏️",
      "Anime e cultura geek 🌸",
      "Música. Muita música. Não consigo ficar sem escutar",
      `Meu GitHub:
        <a
          href="https://github.com/improhalker"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-pink-300"
        >
          github.com/improhalker
        </a>`,
    ],
  },
  {
    title: ">> Quais linguas eu falo?",
    content: `
      Eu sou brasileiro entao falo nativamente Portugues, mas tenho Ingles avancado e estou aprendendo Mandarim (e esta sendo muito dificil meu deus). <br> Eu estava em duvida entre Japones e mandarim, mas acabou que eu escolhi por questoes geopoliticas que infelizmente estao acontecendo no mundo, e tambem por que eu quero viajar pra China com minha namorada (Coreia e Japao tmb, um dia vou aprender Japones). <br> (╯°□°）╯︵ ┻━┻
    `,
  },
  {
    title: ">> Voce esta bem?",
    content: `
      Ja estive pior, mas estou bem sim, comecei terapia recentemente
    `,
  },
];
</script>

<template>
  <div
    class="bg-[#03010e] shadow-[10px_10px_0px_rgba(0,0,0,0.5)] border-2 border-[var(--ts-primary-pink)] border-r-[#2a0221] border-b-[#2a0221] max-h-[400px] overflow-y-auto"
  >
    <CardWindowHeader title="Thought_Terminal.exe" />

    <div class="p-4 space-y-4 text-sm">
      <div v-for="section in terminalSections" :key="section.title">
        <p class="text-pink-600">{{ section.title }}</p>

        <template v-if="section.content">
          <div
            class="text-pink-100 pl-3 border-l border-pink-900"
            v-html="section.content"
          />
        </template>

        <template v-else-if="section.items">
          <ul class="text-pink-100 space-y-2">
            <li
              v-for="(item, index) in section.items"
              :key="index"
              class="flex items-center gap-2"
            >
              <img
                width="14"
                height="14"
                src="https://blob.gifcities.org/gifcities/7PUF3WHRKMSLRBHDQ5ZTDCLAAHTYTEBJ.gif"
              />

              <span v-html="item"></span>
            </li>
          </ul>
        </template>
      </div>

      <div class="text-pink-500 animate-pulse text-xs">_ aguardando input...</div>
    </div>
  </div>
</template>
