<script setup>
import CardWindowHeader from '../global/CardWindowHeader.vue';
</script>
<template>

     <div class="bg-[#03010e] shadow-[10px_10px_0px_rgba(0,0,0,0.5)]
             border-2 border-[var(--ts-primary-pink)]
             border-r-[#2a0221] border-b-[#2a0221]">
            <CardWindowHeader title="Thought_Terminal.exe" />

            <div class="p-4 space-y-4 text-sm">
                <div>
                    <p class="text-pink-600">>> WHOAMI</p>
                    <p class="text-pink-100 pl-3 border-l border-pink-900">
                        Bom, meu codinome eh TheStarArt_ e tenho 21 anos, esse projeto eh uma tentativa de expressar meu sentimento por tudo que vivo que gosto nesse mundo. ┐(´～｀)┌
                    </p>
                </div>

                <div>
                    <p class="text-pink-600">>> CURRENT_INTERESTS</p>
                    <ul class="text-pink-100 pl-3 space-y-1">
                        <li>- Jogar Cs2 de Awp</li>
                        <li>- Programacao com Vue, Php, Wordpress, Webflow e gosto de ambientes linux tmb 🐧</li>
                        <li>- Lapis de cor (estou voltando a desenhar mais)</li>
                        <li>- Anime - Geek World</li>
                        <li>- Muita musica, mas muita musica (nao consigo ficar sem escutar)</li>
                    </ul>
                </div>

                <div class="text-pink-500 animate-pulse text-xs">
                    _ aguardando input...
                </div>
            </div>
        </div>

</template>