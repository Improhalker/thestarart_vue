<script setup lang="ts">
import type { Component } from "vue";
import { Code2, Gamepad2, Heart, Mail, Palette, ShieldCheck } from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import YoutubeMusic from "@/components/global/YoutubeMusic.vue";
import Chat from "@/components/globalchat/Chat.vue";
import ChangelogView from "@/views/ChangelogView.vue";
import NowPlaying from "@/components/global/NowPlaying.vue";

const interests: Array<[string, string, Component]> = [
  ["Arte", "desenho, anime, estética de internet e experimentação visual", Palette],
  ["Código", "Vue, TypeScript, Laravel, automações e interfaces com personalidade", Code2],
  ["Universos", "jogos, música, personagens, web antiga e coisas que deixam marca", Gamepad2],
  ["Segurança", "curiosidade por sistemas, privacidade e software feito com cuidado", ShieldCheck],
];
</script>

<template>
  <div class="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
    <article class="container-style-dark min-w-0 overflow-hidden border-2 shadow-[8px_8px_0_rgba(0,0,0,0.7)]">
      <CardWindowHeader title="THESTARART_PROFILE.EXE" />

      <div class="space-y-6 p-4 sm:p-6">
        <header class="border-b border-[var(--ui-border)] pb-5 text-center">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--ts-primary-pink)]">arquivo de usuário carregado</p>
          <h1 class="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">TheStarArt_</h1>
          <p class="mt-2 text-xs text-gray-300">Programação, desenho, música e experimentos no mesmo universo digital.</p>
        </header>

        <section class="grid gap-4 border-b border-[var(--ui-border)] pb-6 sm:grid-cols-[8rem_minmax(0,1fr)]" aria-labelledby="about-title">
          <div class="border-2 border-[var(--ts-primary-pink)] bg-black p-1 shadow-[4px_4px_0_rgba(0,0,0,0.65)]">
            <img src="https://blob.gifcities.org/gifcities/ARYYMX5I53VOB4XIHQ7VMOOHZIEXBGQG.gif" alt="Arquivo visual do TheStarArt" class="h-32 w-full object-cover pixelated" />
          </div>
          <div class="space-y-3">
            <h2 id="about-title" class="text-sm font-bold uppercase text-[var(--ts-primary-pink)]">About.exe</h2>
            <p class="text-sm leading-relaxed text-gray-200">TheStarArt_ é um espaço pessoal feito para juntar o que normalmente fica separado: arte, desenvolvimento, música, jogos e a vontade de testar ideias estranhas na internet.</p>
            <p class="text-sm leading-relaxed text-gray-200">Não é um portfólio neutro. É um arquivo vivo — com posts, desenhos, rádios, interfaces retrô e pequenas experiências que carregam um pouco de quem está por trás do código.</p>
          </div>
        </section>

        <section class="space-y-3" aria-labelledby="interests-title">
          <h2 id="interests-title" class="text-sm font-bold uppercase text-white">Interesses.dat</h2>
          <ul class="grid gap-3 sm:grid-cols-2">
            <li v-for="[title, description, icon] in interests" :key="title" class="border border-[var(--ui-border)] bg-black/20 p-3">
              <component :is="icon" :size="17" class="mb-2 text-[var(--ts-primary-pink)]" aria-hidden="true" />
              <h3 class="text-xs font-bold uppercase text-white">{{ title }}</h3>
              <p class="mt-1 text-[11px] leading-relaxed text-gray-300">{{ description }}</p>
            </li>
          </ul>
        </section>

        <section class="border-y border-[var(--ui-border)] py-5" aria-labelledby="details-title">
          <h2 id="details-title" class="mb-3 text-sm font-bold uppercase text-white">Detalhes do perfil</h2>
          <dl class="grid gap-x-5 gap-y-3 text-xs sm:grid-cols-2">
            <div><dt class="uppercase text-gray-500">Ocupação</dt><dd class="mt-1 text-gray-200">Desenvolvedor full stack e artista digital.</dd></div>
            <div><dt class="uppercase text-gray-500">Status</dt><dd class="mt-1 text-gray-200">Construindo o TheStarArt_ em público.</dd></div>
            <div><dt class="uppercase text-gray-500">Ferramentas</dt><dd class="mt-1 text-gray-200">Vue, TypeScript, Laravel, Node.js e WordPress.</dd></div>
            <div><dt class="uppercase text-gray-500">Missão atual</dt><dd class="mt-1 text-gray-200">Fazer a web parecer pessoal de novo.</dd></div>
          </dl>
        </section>

        <NowPlaying />

        <section class="border-y border-[var(--ui-border)] py-5" aria-labelledby="otpokemon-title">
          <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center">
            <div class="space-y-3">
              <h2 id="otpokemon-title" class="text-sm font-bold uppercase text-white">OTPokémon.log</h2>
              <p class="text-sm leading-relaxed text-gray-200">Quando o código para um pouco, meu personagem continua explorando. OT Pokémon é uma das minhas pausas favoritas: um mundo de Tibia atravessado por Pokémon, grind e pequenas histórias que vão ficando no caminho.</p>
              <p class="text-[11px] uppercase text-[var(--ts-primary-pink)]">Character archive / LordZoock</p>
            </div>
            <figure class="border-2 border-[var(--ts-primary-pink)] bg-black p-1 shadow-[4px_4px_0_rgba(0,0,0,0.65)]">
              <img src="/images/lordzoock.png" alt="Print do personagem LordZoock no OT Pokémon" class="h-auto w-full object-cover pixelated" />
              <figcaption class="p-2 text-center text-[9px] uppercase text-gray-400">LordZoock.png</figcaption>
            </figure>
          </div>
        </section>

        <section class="space-y-3" aria-labelledby="contact-title">
          <h2 id="contact-title" class="text-sm font-bold uppercase text-white">Contatando TheStarArt_</h2>
          <a href="mailto:contact.thestarart@gmail.com" class="inline-flex items-center gap-2 border border-[var(--ts-primary-pink)] px-3 py-2 text-xs uppercase text-white transition-colors hover:bg-[var(--ts-primary-pink)]">
            <Mail :size="15" aria-hidden="true" /> Enviar mensagem
          </a>
          <p class="flex items-center gap-2 text-[11px] text-gray-400"><Heart :size="13" class="text-[var(--ts-primary-pink)]" aria-hidden="true" /> Feito com curiosidade, café e uma quantidade suspeita de música.</p>
        </section>
      </div>
    </article>

    <aside class="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-1" aria-label="Widgets do perfil">
      <YoutubeMusic />
      <section class="border-2 container-style-dark"><CardWindowHeader title="CHATROOM.EXE" /><Chat class="!my-0 !mb-0" height="347px" /></section>
      <ChangelogView variant="retro-pink" :limit="5" :fullHeight="false" />
    </aside>
  </div>
</template>
